"use strict";

function namespace(func, object) {
  const ns = Object.create(null);

  let export_ = function(objects) {
    for (let name in objects)
      ns[name] = objects[name];
  };

  Object.defineProperty(ns, "export", {
    value: export_,
    enumerable: false,
    configurable: false,
    writable: false
  });
  
  if (typeof object == "function") {
    object.prototype = ns;
    let instance = new object();
    return func(instance) || instance;
  } else if (typeof object == "object") {
    object.export = function(objects) {
      for (let name in objects)
        object[name] = objects[name];
    };
    return func(object) || object; 
  }
  return func(ns) || ns;
}

const std = namespace(() => {
  let buffer = new ArrayBuffer(102400000);
  let byteOffset = 8;

  const pointer_size = 4; // 32

  const uint8array = new Uint8Array(buffer);
  const int8array = new Int8Array(buffer);

  const uint16array = new Uint16Array(buffer);
  const int16array = new Int16Array(buffer);

  const uint32array = new Uint32Array(buffer);
  const int32array = new Int32Array(buffer);

  const float32array = new Float32Array(buffer);
  const float64array = new Float64Array(buffer);

  const biguint64array = new BigUint64Array(buffer);
  const bigint64array = new BigInt64Array(buffer);

  const load = { __proto__: null };
  const store = { __proto__: null };

  {
    function u8(offset, value) {
      if (value == undefined)
        return uint8array[offset];
      return uint8array[offset] = value;
    }

    function i8(offset, value) {
      if (value == undefined)
        return int8array[offset];
      return int8array[offset] = value;
    }

    function u16(offset, value) {
      if (value == undefined)
        return uint16array[offset >> 1];
      return uint16array[offset >> 1] = value;
    }

    function i16(offset, value) {
      if (value == undefined)
        return int16array[offset >> 1];
      return int16array[offset >> 1] = value;
    }

    function u32(offset, value) {
      if (value == undefined)
        return uint32array[offset >> 2];
      return uint32array[offset >> 2] = value;
    }

    function i32(offset, value) {
      if (value == undefined)
        return int32array[offset >> 2];
      return int32array[offset >> 2] = value;
    }

    function f32(offset, value) {
      if (value == undefined)
        return float32array[offset >> 2];
      return float32array[offset >> 2] = value;
    }

    function f64(offset, value) {
      if (value == undefined)
        return float64array[offset >> 3];
      return float64array[offset >> 3] = value;
    }

    function bi64(offset, value) {
      if (value == undefined)
        return bigint64array[offset >> 3];
      return bigint64array[offset >> 3] = value;
    }

    function bu64(offset, value) {
      if (value == undefined)
        return biguint64array[offset >> 3];
      return biguint64array[offset >> 3] = value;
    }

    load.i8 = function(offset) {
      expect(offset).typeIs("number");
      return i8(offset);
    };

    load.u8 = function(offset) {
      expect(offset).typeIs("number");
      return u8(offset);
    };

    load.i16 = function(offset) {
      expect(offset).typeIs("number");
      return i16(offset);
    };

    load.u16 = function(offset) {
      expect(offset).typeIs("number");
      return u16(offset);
    };

    load.i32 = function(offset) {
      expect(offset).typeIs("number");
      return i32(offset);
    };

    load.u32 = function(offset) {
      expect(offset).typeIs("number");
      return u32(offset);
    };

    load.f32 = function(offset) {
      expect(offset).typeIs("number");
      return f32(offset);
    };

    load.f64 = function(offset) {
      expect(offset).typeIs("number");
      return f64(offset);
    };

    load.i64 = function(offset) {
      expect(offset).typeIs("number");
      return bi64(offset);
    };

    load.u64 = function(offset) {
      expect(offset).typeIs("number");
      return bu64(offset);
    };


    // store
    store.i8 = function(offset, value) {
      expect(offset).typeIs("number");
      expect(value).typeIs("number");
      return i8(offset, value);
    };

    store.u8 = function(offset, value) {
      expect(offset).typeIs("number");
      expect(value).typeIs("number");
      return u8(offset, value);
    };

    store.i16 = function(offset, value) {
      expect(offset).typeIs("number");
      expect(value).typeIs("number");
      return i16(offset, value);
    };

    store.u16 = function(offset, value) {
      expect(offset).typeIs("number");
      expect(value).typeIs("number");
      return u16(offset, value);
    };

    store.i32 = function(offset, value) {
      expect(offset).typeIs("number");
      expect(value).typeIs("number");
      return i32(offset, value);
    };

    store.u32 = function(offset, value) {
      expect(offset).typeIs("number");
      expect(value).typeIs("number");
      return u32(offset, value);
    };

    store.f32 = function(offset, value) {
      expect(offset).typeIs("number");
      expect(value).typeIs("number");
      return f32(offset, value);
    };

    store.f64 = function(offset, value) {
      expect(offset).typeIs("number");
      expect(value).typeIs("number");
      return f64(offset, value);
    };

    store.i64 = function(offset, value) {
      expect(offset).typeIs("number");
      expect(value).typeIs("number");
      return bi64(offset, value);
    };

    store.u64 = function(offset, value) {
      expect(offset).typeIs("number");
      expect(value).typeIs("number");
      return bu64(offset, value);
    };
  }

  function roundup(num, r) {
    return (num + r - 1) & -r;
  }

  const allocSizeMap = new Map();
    
  const alloc = (byteLength) => {
    let offset = byteOffset;
    let size = roundup(byteLength, 4);
    byteOffset += size;
    allocSizeMap.set(offset, size);
    return offset;
  };

  const sCtor = Symbol("function");
  const sDepth = Symbol("depth");
  const sType = Symbol("type");
  const sOffset = Symbol("offset");
  const sSize = Symbol("size");
  const sLength = Symbol("length");

  const primitives = new Set();

  const copyBytes = (src, dest, size) => {
    new Int8Array(buffer, dest, size).set(new Int8Array(buffer, src, size));
  };

  function Assert(value) {
    this.value = value;
  }

  Assert.prototype.typeIs = function(type) {
    if (typeof this.value != type)
      throw new TypeError("value must be typeof \"" + type + "\".");
  };

  Assert.prototype.isInstanceOf = function(func) {
    if (!(this.value instanceof func))
      throw new TypeError("'" + this.value + "' is not an instanceof " + func + ".");
  };

  function expect(value) {
    return new Assert(value);
  }

  function Type(func, depth=0) {
    expect(func).typeIs("function");
    expect(depth).typeIs("number");
    //expect(func[sSize]).typeIs("number");

    this[sCtor] = func;
    this[sDepth] = depth;
  }

  Type.prototype.init = function(offset, value) {
    if (offset == null || offset == 0)
      offset = this.isPointer() ? alloc(pointer_size) : alloc(this.size());
    expect(offset).typeIs("number");
    if (this.isPointer())
      return new Pointer(this[sCtor], this[sDepth], offset, value);
    if (this.isPrimitive())
      return new this[sCtor](offset, value);
    if (value != undefined)
      copyBytes(typeof value == "number" ? value : value[sOffset], this[sOffset], this.size());
    
    return new this[sCtor](offset);
  };

  Type.prototype.array = function(length) {
    expect(length).typeIs("number");
    return new TypeArray(this, length);
  };

  Type.prototype.isPointer = function() {
    return this[sDepth] > 0;
  };

  Type.prototype.isPrimitive = function() {
    return primitives.has(this[sCtor]);
  };

  Type.prototype.size = function() {
    if (this.isPointer()) return pointer_size;
    const size = this[sCtor][sSize];
    expect(size).typeIs("number");
    return size;
  };

  const toAddress = (value) => {
    if (typeof value == "number")
      return value;
    if (value instanceof Pointer)
      return load.u32(value[sOffset]);
    let addr = 0;
    if (typeof value == "object" && typeof (addr = value[sOffset]) == "number")
      return addr;
    throw new TypeError("Unable to convert 'value' to address.");
  };

  function Pointer(func, depth, offset, value) {
    this[sCtor] = func;
    this[sDepth] = depth;
    this[sOffset] = offset;

    if (typeof value == "number")
      store.u32(this[sOffset], value);
    else if (value instanceof Pointer)
      store.u32(this[sOffset], value[sOffset]);
    else if (typeof value == "object" && typeof value[sOffset] == "number")
      store.u32(this[sOffset], value[sOffset]);
  }

  Pointer.prototype.deref = function(value) {
    let offset = load.u32(this[sOffset]);
    if (offset == 0) throw new Error("unable to dereference a null pointer.");
    if (value != undefined) {
      if (this[sDepth] == 1)
        return (new Type(this[sCtor])).init(offset, value);
      expect(value).typeIs("number");
      store.u32(this[sOffset], value);
      return value;
    } else {
      if (this[sDepth] == 1)
        return new this[sCtor](offset);
      return new Pointer(this[sCtor], this[sDepth] - 1, offset);
    }
  };

  Pointer.prototype.at = function(index) {
    expect(index).typeIs("number");
    const type = new Type(this[sCtor]);
    if (this[sDepth] == 1)
      return type.init(load.u32(this[sOffset]) + (index * type.size()));
    return new Pointer(this[sCtor], this[sDepth] - 1, load.u32(this[sOffset]) + (index * pointer_size));
  };

  Pointer.prototype.put = function(index, value) {
    const type = new Type(this[sCtor]);
    expect(index).typeIs("number");
    if (this[sDepth] == 1)
      return type.init(load.u32(this[sOffset]) + (index * type.size()), value);
    return new Pointer(this[sCtor], this[sDepth] - 1, load.u32(this[sOffset]) + (index * pointer_size), value);
  };

  Pointer.prototype.isNullptr = function() {
    return load.u32(this[sOffset]) == 0;
  };

  Pointer.prototype.valueOf = function() {
    return load.u32(this[sOffset]);
  };

  Pointer[sSize] = pointer_size;

  // implementation of an Type Array
  function TypeArray(type, length) {
    expect(type).isInstanceOf(Type);
    expect(length).typeIs("number");

    this[sType] = type;
    this[sLength] = length;
    this[sSize] = length * type.size();
  }

  TypeArray.prototype.init = function(offset, value) {
    if (offset == null || offset == 0)
      offset = alloc(this.size());
    expect(offset).typeIs("number");
    return new ArrayRef(this[sType], offset, this[sLength], value);
  };

  TypeArray.prototype.length = function() {
    return this[sLength];
  };

  TypeArray.prototype.size = function() {
    return this[sSize];
  };

  // implementation of an type Array value
  function ArrayRef(type, offset, length) {
    expect(type).isInstanceOf(Type);
    expect(offset).typeIs("number");
    expect(length).typeIs("number");

    this[sType] = type;
    this[sOffset] = offset;
    this[sLength] = length;
  }

  ArrayRef.prototype.at = function(index) {
    expect(index).typeIs("number");
    if (index > this[sLength])
      throw new Error("index " + index + " is out of bounds [" + this[sLength] + "]");
    return this[sType].init(this[sOffset] + (index * this[sType].size()));
  };

  ArrayRef.prototype.put = function(index, value) {
    expect(index).typeIs("number");
    this[sType].init(this[sOffset] + (index * this[sType].size()), value);
    return value;
  };

  // implementation of void type
  function Void(offset) {
    expect(offset).typeIs("number");
    this[sOffset] = offset;
  }

  Void.prototype.valueOf = function() {
    return this[sOffset];
  };

  Void[sSize] = 0;

  const voidptr = new Type(Void, 1);
  const voidptrptr = new Type(Void, 2);

  // implementation of char type
  function Char(offset, value) {
    expect(offset).typeIs("number");
    this[sOffset] = offset;

    if (value != undefined)
      store.u8(offset, value instanceof Char ? load.u8(value[sOffset])
        : (typeof value == "string" ? value.charCodeAt(0) : value));
  }
  
  Char.prototype.valueOf = function() {
    return load.u8(this[sOffset]);
  };

  Char.prototype.toString = function() {
    return String.fromCharCode(this.valueOf());
  };

  Char[sSize] = 1;
  primitives.add(Char);
  
  const char = new Type(Char);
  const charptr = new Type(Char, 1);
  const charptrptr = new Type(Char, 2);

  const u8 = char;
  const u8ptr = charptr;
  const u8ptrptr = charptrptr;
  
  // implementation of boolean type
  function Bool(offset, value) {
    expect(offset).typeIs("number");
    this[sOffset] = offset;
    if (value != undefined)
      store.u8(offset, value instanceof Bool ? load.u8(value[sOffset])
        : (typeof value == "boolean" ? (value ? 1 : 0) : value));
  }
  
  Bool.prototype.valueOf = function() {
    return load.u8(this[sOffset]) > 0;
  };

  Bool[sSize] = 1;
  primitives.add(Bool);

  const bool = new Type(Bool);
  const boolptr = new Type(Bool, 1);
  const boolptrptr = new Type(Bool, 2);

  // implementation of signed int type
  function Int32(offset, value) {
    expect(offset).typeIs("number");
    this[sOffset] = offset;

    if (value != undefined)
      store.i32(offset, value instanceof Int32 ? load.i32(value[sOffset]) : value);
  }

  Int32.prototype.valueOf = function() {
    return load.i32(this[sOffset]);
  };

  Int32[sSize] = 4;
  primitives.add(Int32);

  const i32 = new Type(Int32);
  const i32ptr = new Type(Int32, 1);
  const i32ptrptr = new Type(Int32, 2);

  // implementation of UNsigned int type
  function Uint32(offset, value) {
    expect(offset).typeIs("number");
    this[sOffset] = offset;

    if (value != undefined)
      store.u32(offset, value instanceof Int32 ? load.u32(value[sOffset]) : value);
  }

  Uint32.prototype.valueOf = function() {
    return load.u32(this[sOffset]);
  };

  Uint32[sSize] = 4;
  primitives.add(Uint32);

  const u32 = new Type(Int32);
  const u32ptr = new Type(Int32, 1);
  const u32ptrptr = new Type(Int32, 2);

  // implementation of float type
  function Float(offset, value) {
    expect(offset).typeIs("number");
    this[sOffset] = offset;

    if (value != undefined)
      store.f32(offset, value instanceof Int32 ? load.f32(value[sOffset]) : value);
  }

  Float.prototype.valueOf = function() {
    return load.f32(this[sOffset]);
  };

  Float[sSize] = 4;
  primitives.add(Float);
  
  const float = new Type(Float);
  const floatptr = new Type(Float, 1);
  const floatptrptr = new Type(Float, 2);

  // implementation of double type
  function Double(offset, value) {
    expect(offset).typeIs("number");
    this[sOffset] = offset;

    if (value != undefined)
      store.f64(offset, value instanceof Int32 ? load.f64(value[sOffset]) : value);
  }

  Double.prototype.valueOf = function() {
    return load.f64(this[sOffset]);
  };

  Double[sSize] = 8;
  primitives.add(Double);


  // implementation of string utf-8 type
  function StringUtf8(offset, value) {
    expect(offset).typeIs("number");
    this[sOffset] = offset;

    if (value == undefined) return;
    let str_len = value.length;
    let str_offset = alloc(roundup(str_len + 4, 4));
    store.u32(str_offset, str_len);
    store.u32(offset, str_offset);

    for (let index = 0; index < str_len; index++) {
      store.u8(str_offset + 4 + index, value.charCodeAt(index));
    }
  }

  StringUtf8.prototype.toString = function() {
    let str_offset = load.u32(this[sOffset]);
    let str_len = load.u32(str_offset);
    let str_arr = [];

    for (let index = 0; index < str_len; index++) {
      str_arr.push(String.fromCharCode(load.u8(str_offset + 4 + index)));
    }
    return str_arr.join("");
  };

  StringUtf8[sSize] = 4;
  primitives.add(StringUtf8);

  const set = (obj, value) => {
    if (obj instanceof Pointer)
      store.u32(obj[sOffset], value);
  };

  const offsetOf = (obj) => {
    return obj[sOffset];
  };

  const sizeOf = (obj) => {
    return obj[sSize];
  };

  const string = new Type(StringUtf8);
  const stringptr = new Type(StringUtf8, 1);
  const stringptrptr = new Type(StringUtf8, 2);

  const equals = (obj1, obj2) => {
    if (obj1 instanceof Pointer && obj2 instanceof Pointer)
      return obj1[sOffset] == obj2[sOffset] && obj1[sCtor] == obj2[sCtor]
        && obj1[sDepth] == obj2[sDepth];
  };

  const getGetterSetter = (type, offset) => {
    return {
      get() {
        return type.init(this[sOffset] + offset);
      },
      set(value) {
        return type.init(this[sOffset] + offset, value);
      }
    };
  };

  const struct = (obj, prop, isUnion = false) => {
    let offset = Object.getPrototypeOf(obj).constructor[sSize] || 0;
    let size = 0;
    let sizes = [8,4,2];
    for (let name in prop) {
      let type = prop[name];
      expect(type).isInstanceOf(Type);
      
      for (let index = 0; index < 3; index++) {
        let modulo = sizes[index];
        if (type.size() % modulo == 0 && offset % modulo != 0 && type.size() == modulo) {
          offset = roundup(offset, modulo);
          break;
        }
      }
      
      let getset = getGetterSetter(type, offset);
      Object.defineProperty(obj, name, {
        get: getset.get,
        set: getset.set,
        enumerable: true,
        configurable: false
      });
      
      !isUnion ? offset += type.size(): size = Math.max(offset, size);
    }

    obj.constructor[sSize] = !isUnion ? roundup(offset, 4) : roundup(size, 4);
  };
  
  struct.init = function(object, pointer, args) {
    expect(object).typeIs("object");
    let constructor = object[object.constructor.name] || function() { };
    let size = object.constructor[sLength];
    
    if (pointer == undefined) {
      pointer = alloc(size);
      args = [];
    }
    
    if (typeof pointer == "number") {
      object[sOffset] = pointer;
      if (Array.isArray(args))
        constructor.apply(object, args);
      return;
    }

    if (Array.isArray(pointer)) {
      args = pointer;
      pointer = alloc(size);
      object[sOffset] = pointer;
      constructor.apply(object, args);
      return;
    }
    throw new Error("Invalid arguments.");
  };
  
  struct.type = function type(func) {
    return new Type(func);
  };
  
  struct.pointer = function pointer(func, depth=1) {
    expect(depth).typeIs("number");
    return new Type(func, depth);
  };
  
  return { sOffset, Type, Pointer, struct, set, offsetOf, sizeOf, load, store, u8, u8ptr, u8ptrptr, i32, i32ptr, i32ptrptr, u32, u32ptr, u32ptrptr, voidptr, voidptrptr, char, charptr, charptrptr, string, stringptr, stringptrptr, bool, boolptr, boolptrptr, float, floatptr, floatptrptr };
});

const { struct, bool, i32, float, string, sOffset } = std;

debugger;


const v8 = namespace((v8) => {
  const _ = "prototype";
  const { u8, u8ptr, i32, i32ptr, u32, u32ptr, char, float, string, bool, struct, voidptr } = std;
  const $type = struct.type;
  const $ptr = struct.pointer;
  
  const internal = namespace((internal) => {
    const KB = 1024;
    const MB = KB * KB;
    const kMaxInt = 0x7FFFFFFF;
  
    const kIntSize = 4;
    // int size in 32 bit machine
    const kPointerSize = 4;
    // pointer size in 32 bit machine
  
    const kHeapObjectTag = 1;

    const kFailureTag = 3;
    const kFailureTagSize = 2;
    const kFailureTagMask = (1 << kFailureTagSize) - 1;
  
    const kBitsPerByte = 8;
    const kBitsPerPointer = kPointerSize * kBitsPerByte;
  
    const Max = (a, b) => a < b ? b : a;
    const Min = (a, b) => a < b ? a : b;
  
    const OffsetFrom = (x) => x - 0;
    const AddressFrom = (x) => (0 + x);
  
    const RoundDown = (x, m) => AddressFrom(OffsetFrom(x) & -m);
    const RoundUp = (x, m) => RoundDown(x + m - 1, m);
  
    const RoundUpToPowerOf2 = (x) => {
      x = x - 1;
      x = x | (x >> 1);
      x = x | (x >> 2);
      x = x | (x >> 4);
      x = x | (x >> 8);
      x = x | (x >> 16);
      return x + 1;
    }
    
    const AllocationSpace = {
      NEW_SPACE: 0,
      OLD_SPACE: 1,
      CODE_SPACE: 2,
      MAP_SPACE: 3,
      LO_SPACE: 4,
      FIRST_SPACE: 0,
      LAST_SPACE: 4
    };

    const Address = u8ptr;

    // class FlagValue
    function FlagValue() {
      struct.init(this, ...arguments);
    }
    
    FlagValue.New_BOOL = function(b) {
      let v = new FlagValue();
      v.b = b;
      return v;
    };
    
    FlagValue.New_INT = function() {
      let v = new FlagValue();
      v.i = i;
      return v;
    }
    
    FlagValue.New_FLOAT = function() {
      let v = new FlagValue();
      v.f = f;
      return v;
    }
    
    FlagValue.New_STRING = function() {
      let v = new FlagValue();
      v.s = s;
      return v;
    }
    
    struct(FlagValue[_], {
      b: bool,
      i: i32,
      f: float,
      s: string
    });

    // class Flag
    function Flag() {
      struct.init(this, ...arguments);
    }
    
    Flag.Type = {
      BOOL: 1, INT: 2, FLOAT: 3, STRING: 4,
      __proto__: null
    };

    Flag[_].Flag = function() {
      console.log(...arguments);
    }

    Flag[_].file = function() {
      return this.file_;
    }
    
    Flag[_].name = function() {
      return this.name_;
    }
    
    Flag[_].comment = function() {
      return this.comment_;
    }
    
    Flag[_].type = function() {
      return this.type_;
    }
    
    Flag[_].bool_variable = function(value) {
      if (value == undefined)
        return this.variable_.b; 
      return this.variable_.b = value;
    }
    
    Flag[_].int_variable = function(value) {
      if (value == undefined)
        return this.variable_.i; 
      return this.variable_.i = value;
    }
    
    Flag[_].float_variable = function(value) {
      if (value == undefined)
        return this.variable_.f; 
      return this.variable_.f = value;
    }
    
    Flag[_].string_variable = function(value) {
      if (value == undefined)
        return this.variable_.s; 
      return this.variable_.s = value;
    }

    struct(Flag[_], {
      file_: string,
      name_: string,
      comment_: string,
      
      type_: i32,
      variable_: struct.pointer(FlagValue),
      default_: struct.type(FlagValue),
      
      next_: struct.pointer(Flag) // Flag pointer
    });

    const flag = new Flag(8);
    console.log(flag);
  });
});

debugger;