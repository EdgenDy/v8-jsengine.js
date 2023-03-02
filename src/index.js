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

  const free = (offset) => {

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
  
  Assert.prototype.isNot = function() {
    let args = arguments;
    for (let arg in  args)
      if (this.value == args[arg])
        throw new Error(this.value + " must not be equals to " + args[arg] + ".");
  };

  Assert.prototype.isTrue = function() {
    if (this.value !== true)
      throw new TypeError("value must be true.");
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
    if (offset == null || offset == 0 || offset == undefined)
      offset = this.isPointer() ? alloc(pointer_size) : alloc(this.size());
    //expect(offset).typeIs("number");
    if (this.isPointer())
      return new Pointer(this[sCtor], this[sDepth], offset, value);
    if (this.isPrimitive())
      return new this[sCtor](offset, value);
    if (value != undefined)
      copyBytes(typeof value == "number" ? value : value[sOffset], offset, this.size());
    
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
      store.u32(this[sOffset], depth > 1 ? value[sOffset] : load.u32(value[sOffset]));
    else if (typeof value == "object" && typeof value[sOffset] == "number")
      store.u32(this[sOffset], value[sOffset]);
  }

  Pointer.prototype.deref = function(value) {
    let offset = this.valueOf();
    if (offset == 0) throw new Error("unable to dereference a null pointer.");
    if (value != undefined) {
      if (this[sDepth] == 1)
        return (new Type(this[sCtor])).init(offset, value);
      return new Pointer(this[sCtor], this[sDepth] - 1, offset, value);
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
  const nullptr = voidptr.init(null, new Void(0));

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

  const struct = function struct(obj, prop, isUnion = false) {
    let offset = Object.getPrototypeOf(obj).constructor[sSize] || 0;
    let size = 0;
    let sizes = [8,4,2];
    for (let name in prop) {
      let type = prop[name];
      //expect(type).isInstanceOf(Type);
      
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
      
      !isUnion ? offset += type.size(): size = Math.max(type.size(), size);
    }

    obj.constructor[sSize] = !isUnion ? roundup(offset, 4) : roundup(size, 4);
  };
  
  struct.init = function init(object, pointer, args) {
    expect(object).typeIs("object");
    let constructor = object[object.constructor.name] || function() { };
    let size = object.constructor[sSize];
    
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

  struct.inheritStatic = function(child, base) {
    for (let name in base)
      if (Object.hasOwn(base, name))
        child[name] = base[name];
  };

  struct["*"] = function(pointer, value) {
    expect(pointer).isInstanceOf(Pointer);
    return pointer.deref(value);
  };

  struct["&"] = function(object) {
    expect(object).isNot(undefined, null);
    let offset = object[sOffset];
    expect(offset).typeIs("number");
    return offset;
  };

  const tester_buffer = new ArrayBuffer(64);
  const tester_i32 = new Int32Array(tester_buffer);
  const utils = {
    to: {
      i32(value) {
        tester_i32[0] = value;
        return tester_i32[0];
      }
    }
  };

  const memory = function memory(offset, size) {
    return {
      setValue(value) {
        new Uint8Array(buffer, offset, size).fill(0);
      },
      copy(src, dest, size) {
        new Int8Array(buffer, dest, size).set(new Int8Array(buffer, src, size));
      }
    };
  };

  function StackValue(object) {
    this.value = object;
  }

  StackValue.prototype.set = function set(object) {
    this.value = object;
  };

  StackValue.prototype.deref = function deref(object) {
    this.set(object);
  };

  StackValue.prototype.valueOf = function() {
    return this.value;
  };

  const stack = {
    value(object) {
      return new StackValue(object);
    }
  };
  
  return { expect, nullptr, stack, memory, utils, alloc, free, sOffset, Type, Pointer, struct, set, offsetOf, sizeOf, load, store, u8, u8ptr, u8ptrptr, i32, i32ptr, i32ptrptr, u32, u32ptr, u32ptrptr, voidptr, voidptrptr, char, charptr, charptrptr, string, stringptr, stringptrptr, bool, boolptr, boolptrptr, float, floatptr, floatptrptr };
});

const { struct, bool, i32, float, string, sOffset } = std;




const v8 = namespace((v8) => {
  const _ = "prototype";
  const { expect, load, store, stack, memory, utils, alloc, free, offsetOf, sizeOf, u8, u8ptr, i32, i32ptr, u32, u32ptr, char, float, string, bool, struct, voidptr } = std;
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
    const kHeapObjectTagSize = 2;
    const kHeapObjectTagMask = (1 << kHeapObjectTagSize) - 1;

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

    const HAS_HEAP_OBJECT_TAG = (value) => (value & kHeapObjectTagMask) == kHeapObjectTag;
    
    const AllocationSpace = {
      NEW_SPACE: 0,
      OLD_SPACE: 1,
      CODE_SPACE: 2,
      MAP_SPACE: 3,
      LO_SPACE: 4,
      FIRST_SPACE: 0,
      LAST_SPACE: 4
    };

    const byte = u8;
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
    }, true);

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

    const Type2String = (type) => {
      switch (type) {
        case Flag.Type.BOOL: return "bool";
        case Flag.Type.INT: return "int";
        case Flag.Type.FLOAT: return "float";
        case Flag.Type.STRING: return "string";
      }
      return null;
    };

    const FlagList = new (function FlagList() { });
    FlagList.Lookup = function(name) {
      let f = this.list_();
      while (f != nullptr && name != f.name())
        f = f.next();
      return f;
    }
    
    FlagList.SetFlagsFromCommandLine = function(argc, argv, remove_flags) {
      for (let i = 0; i < argc;) {
        let j = i;
        
        let arg = argv[i++];
        let { name, value, is_bool } = this.SplitArgument(arg);
        
        if (name != null) {
          let flag = this.Lookup(name);
          if (flag == nullptr) {
            if (remove_flags) {
              continue;
            } else {
              console.error("Error: unrecognized flag " + arg + "\n");
              return j;
            }
          }
          
          if (flag.type() != Flag.Type.BOOL && value == null) {
            if (i < argc) {
              value = argv[i++];
            } else {
              console.error("Error: missing value for flag " + arg + " of type " + Type2String(flag.type()) + "\n");
              return j;
            }
          }
          
          switch (flag.type()) {
            case Flag.Type.BOOL:
              flag.bool_variable(!is_bool);
              break;
            case Flag.Type.INT:
              flag.int_variable(parseInt(value));
              break;
            case Flag.Type.FLOAT:
              flag.float_variable(parseFloat(value));
              break;
            case Flag.Type.STRING:
              flag.string_variable(value);
              break;
          }
          
          if ((flag.type() == Flag.Type.BOOL && value != null)
                || (flag.type() != Flag.Type.BOOL && is_bool)) {
            console.error("Error: illegal value for flag " + arg + " of type " + Type2String(flag.type()) + "\n");
            return j;
          }
          
          if (remove_flags)
            while (j < i)
              argv[j++] = null;
        }
      }
      
      if (remove_flags) {
        let j = 0;
        for (let i = 0; i < argc; i++) {
          if (argv[i] != null)
            argv[j++] = argv[i];
        }
        argc = j;
      }
      
      return 0;
    }
    
    FlagList.SplitArgument = function(arg) {
      let name = null;
      let value = null;
      let is_bool = false;
      
      let arg_arr = arg.split("=");
      name = arg_arr.length == 0 ? null : arg_arr[0].trim();
      value = arg_arr.length < 2 ? null : arg_arr[1].trim();
      
      if (name && name.charAt(0) == "-")
        if (name.charAt(1) == "-")
          name = name.substr(2);
        else
          name = name.substr(1);
      
      if (name == "no")
        is_bool = true;
      
      return { name, value, is_bool };
    }

    FlagList.list_ = struct.pointer(Flag).init(0);
    internal.export({ FlagList });
    
    const kIsNotStringMask = 0x80;
    const kStringTag = 0x0;
    const kNotStringTag = 0x80;

    const kStringSizeMask = 0x60;
    const kShortStringTag = 0x0;
    const kMediumStringTag = 0x20;
    const kLongStringTag = 0x40;

    const kIsSymbolMask = 0x10;
    const kNotSymbolTag = 0x0;
    const kSymbolTag = 0x10;

    const kStringEncodingMask = 0x8;
    const kTwoByteStringTag = 0x0;
    const kAsciiStringTag = 0x8;

    const kStringRepresentationMask = 0x07;

    const StringRepresentationTag = {
      kSeqStringTag: 0x0,
      kConsStringTag: 0x1,
      kSlicedStringTag: 0x2,
      kExternalStringTag: 0x3
    };

    const InstanceType = {
      SHORT_SYMBOL_TYPE : kShortStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag,
      MEDIUM_SYMBOL_TYPE : kMediumStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag,
      LONG_SYMBOL_TYPE : kLongStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag,
      SHORT_ASCII_SYMBOL_TYPE : kShortStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag,
      MEDIUM_ASCII_SYMBOL_TYPE : kMediumStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag,
      LONG_ASCII_SYMBOL_TYPE : kLongStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag,
      SHORT_CONS_SYMBOL_TYPE : kShortStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag,
      MEDIUM_CONS_SYMBOL_TYPE : kMediumStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag,
      LONG_CONS_SYMBOL_TYPE : kLongStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag,
      SHORT_CONS_ASCII_SYMBOL_TYPE : kShortStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag,
      MEDIUM_CONS_ASCII_SYMBOL_TYPE : kMediumStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag,
      LONG_CONS_ASCII_SYMBOL_TYPE : kLongStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag,
      SHORT_SLICED_SYMBOL_TYPE : kShortStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag,
      MEDIUM_SLICED_SYMBOL_TYPE : kMediumStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag,
      LONG_SLICED_SYMBOL_TYPE : kLongStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag,
      SHORT_SLICED_ASCII_SYMBOL_TYPE : kShortStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag,
      MEDIUM_SLICED_ASCII_SYMBOL_TYPE : kMediumStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag,
      LONG_SLICED_ASCII_SYMBOL_TYPE : kLongStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag,
      SHORT_EXTERNAL_SYMBOL_TYPE : kShortStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag,
      MEDIUM_EXTERNAL_SYMBOL_TYPE : kMediumStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag,
      LONG_EXTERNAL_SYMBOL_TYPE : kLongStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag,
      SHORT_EXTERNAL_ASCII_SYMBOL_TYPE : kShortStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag,
      MEDIUM_EXTERNAL_ASCII_SYMBOL_TYPE : kMediumStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag,
      LONG_EXTERNAL_ASCII_SYMBOL_TYPE : kLongStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag,
      SHORT_STRING_TYPE : kShortStringTag | StringRepresentationTag.kSeqStringTag,
      MEDIUM_STRING_TYPE : kMediumStringTag | StringRepresentationTag.kSeqStringTag,
      LONG_STRING_TYPE : kLongStringTag | StringRepresentationTag.kSeqStringTag,
      SHORT_ASCII_STRING_TYPE : kShortStringTag | kAsciiStringTag | StringRepresentationTag.kSeqStringTag,
      MEDIUM_ASCII_STRING_TYPE : kMediumStringTag | kAsciiStringTag | StringRepresentationTag.kSeqStringTag,
      LONG_ASCII_STRING_TYPE : kLongStringTag | kAsciiStringTag | StringRepresentationTag.kSeqStringTag,
      SHORT_CONS_STRING_TYPE : kShortStringTag | StringRepresentationTag.kConsStringTag,
      MEDIUM_CONS_STRING_TYPE : kMediumStringTag | StringRepresentationTag.kConsStringTag,
      LONG_CONS_STRING_TYPE : kLongStringTag | StringRepresentationTag.kConsStringTag,
      SHORT_CONS_ASCII_STRING_TYPE : kShortStringTag | kAsciiStringTag | StringRepresentationTag.kConsStringTag,
      MEDIUM_CONS_ASCII_STRING_TYPE : kMediumStringTag | kAsciiStringTag | StringRepresentationTag.kConsStringTag,
      LONG_CONS_ASCII_STRING_TYPE : kLongStringTag | kAsciiStringTag | StringRepresentationTag.kConsStringTag,
      SHORT_SLICED_STRING_TYPE : kShortStringTag | StringRepresentationTag.kSlicedStringTag,
      MEDIUM_SLICED_STRING_TYPE : kMediumStringTag | StringRepresentationTag.kSlicedStringTag,
      LONG_SLICED_STRING_TYPE : kLongStringTag | StringRepresentationTag.kSlicedStringTag,
      SHORT_SLICED_ASCII_STRING_TYPE : kShortStringTag | kAsciiStringTag | StringRepresentationTag.kSlicedStringTag,
      MEDIUM_SLICED_ASCII_STRING_TYPE : kMediumStringTag | kAsciiStringTag | StringRepresentationTag.kSlicedStringTag,
      LONG_SLICED_ASCII_STRING_TYPE : kLongStringTag | kAsciiStringTag | StringRepresentationTag.kSlicedStringTag,
      SHORT_EXTERNAL_STRING_TYPE : kShortStringTag | StringRepresentationTag.kExternalStringTag,
      MEDIUM_EXTERNAL_STRING_TYPE : kMediumStringTag | StringRepresentationTag.kExternalStringTag,
      LONG_EXTERNAL_STRING_TYPE : kLongStringTag | StringRepresentationTag.kExternalStringTag,
      SHORT_EXTERNAL_ASCII_STRING_TYPE : kShortStringTag | kAsciiStringTag | StringRepresentationTag.kExternalStringTag,
      MEDIUM_EXTERNAL_ASCII_STRING_TYPE : kMediumStringTag | kAsciiStringTag | StringRepresentationTag.kExternalStringTag,
      LONG_EXTERNAL_ASCII_STRING_TYPE : kLongStringTag | kAsciiStringTag | StringRepresentationTag.kExternalStringTag,
      LONG_PRIVATE_EXTERNAL_ASCII_STRING_TYPE : 75, //LONG_EXTERNAL_ASCII_STRING_TYPE,
  
      MAP_TYPE : kNotStringTag,
      HEAP_NUMBER_TYPE : 129,
      FIXED_ARRAY_TYPE : 130,
      CODE_TYPE : 131,
      ODDBALL_TYPE : 132,
      PROXY_TYPE : 133,
      BYTE_ARRAY_TYPE : 134,
      FILLER_TYPE : 135,
      SMI_TYPE : 136,
  
      ACCESSOR_INFO_TYPE : 137,
      ACCESS_CHECK_INFO_TYPE : 138,
      INTERCEPTOR_INFO_TYPE : 139,
      SHARED_FUNCTION_INFO_TYPE : 140,
      CALL_HANDLER_INFO_TYPE : 141,
      FUNCTION_TEMPLATE_INFO_TYPE : 142,
      OBJECT_TEMPLATE_INFO_TYPE : 143,
      SIGNATURE_INFO_TYPE : 144,
      TYPE_SWITCH_INFO_TYPE : 145,
      DEBUG_INFO_TYPE : 146,
      BREAK_POINT_INFO_TYPE : 147,
      SCRIPT_TYPE : 148,
  
      JS_OBJECT_TYPE : 149,
      JS_GLOBAL_OBJECT_TYPE : 150,
      JS_BUILTINS_OBJECT_TYPE : 151,
      JS_VALUE_TYPE : 152,
      JS_ARRAY_TYPE : 153,
  
      JS_FUNCTION_TYPE : 154,
  
      FIRST_NONSTRING_TYPE : 128,
      FIRST_TYPE : 0x0,
      LAST_TYPE : 154,
      FIRST_JS_OBJECT_TYPE : 149,
      LAST_JS_OBJECT_TYPE : 153,
    };

    /** @class Object */
    function Object() {
      struct.init(this, ...arguments);
    }

    Object[_].IsHeapObject = function() {
      return HAS_HEAP_OBJECT_TAG(offsetOf(this));
    };

    Object[_].IsFailure = function() {
      return (this[sOffset] & kFailureTagMask) == kFailureTag;
    };

    Object[_].IsMap = function() {
      return this.IsHeapObject() && 
        HeapObject.cast(this).map().deref().instance_type() == InstanceType.MAP_TYPE;
    };

    struct(Object[_], { });
    
    Object.kSize = 0;

    const FIELD_ADDR = (p, offset) => {
      //return u8ptr.init(null, offsetOf(p) + offset - kHeapObjectTag);
      return offsetOf(p) + offset - kHeapObjectTag;
    };

    const READ_FIELD = (p, offset) => {
      return (struct.pointer(Object, 2).init(null, FIELD_ADDR(p, offset))).deref();
    };

    const WRITE_FIELD = (p, offset, value) => {
      (struct.pointer(Object, 2).init(null, FIELD_ADDR(p, offset))).deref(value+0);
    };

    const WRITE_INT_FIELD = (p, offset, value) => {
      i32ptr.init(null, FIELD_ADDR(p, offset)).deref(value);
      //store.i32(FIELD_ADDR(p, offset), value);
    };

    const READ_INT_FIELD = (p, offset) => {
      return i32ptr.init(null, FIELD_ADDR(p, offset)).deref();
      //return store.i32(FIELD_ADDR(p, offset));
    };

    const READ_BYTE_FIELD = (p, offset) => {
      return u8ptr.init(null, FIELD_ADDR(p, offset)).deref();
    };

    const WRITE_BYTE_FIELD = (p, offset, value) => {
      u8ptr.init(null, FIELD_ADDR(p, offset)).deref(value+0);
    };
    
    function HeapObject() {
      Object.call(this, ...arguments);
    }
    
    HeapObject.prototype = { constructor: HeapObject, __proto__: Object.prototype };

    HeapObject[_].map = function() {
      return this.map_word().ToMap();
    };

    HeapObject[_].set_map = function(value) {
      this.set_map_word(MapWord.FromMap(value));
    };

    HeapObject[_].map_word = function() {
      return new MapWord([u8ptr.init(null, READ_FIELD(this, HeapObject.kMapOffset))]);
    };

    HeapObject[_].set_map_word = function(map_word) {
      WRITE_FIELD(this, HeapObject.kMapOffset, struct.pointer(Object).init(null, map_word.value_));
    };

    HeapObject.FromAddress = function(address) {
      return new HeapObject(address + kHeapObjectTag);
    };

    HeapObject.cast = function(object) { // Object*
      expect(object.IsHeapObject()).isTrue();
      return new HeapObject(offsetOf(object));
    };
    
    HeapObject.kMapOffset = Object.kSize;
    HeapObject.kSize = HeapObject.kMapOffset + kPointerSize;
    
    function Map() {
      HeapObject.call(this, ...arguments);
    }
    
    Map.prototype = { constructor: Map, __proto__: HeapObject.prototype };

    Map[_].set_instance_size = function(value) {
      // expect(0 <= value && value > 256).is(true);
      WRITE_BYTE_FIELD(this, Map.kInstanceSizeOffset, value);
    };

    Map[_].instance_size = function() {
      return READ_BYTE_FIELD(this, Map.kInstanceSizeOffset);
    };

    Map[_].instance_type = function() {
      return READ_BYTE_FIELD(this, Map.kInstanceTypeOffset);
    };

    Map[_].set_instance_type = function(value) {
      // expect(0 <= value && value > 256).is(true);
      WRITE_BYTE_FIELD(this, Map.kInstanceTypeOffset, value);
    };

    Map[_].set_unused_property_fields = function(value) {
      WRITE_BYTE_FIELD(this, Map.kUnusedPropertyFieldsOffset, Min(value, 255));
    };

    Map.cast = function(object) { // Object* - HeapObject
      expect(struct.type(Object).init(offsetOf(object)).IsMap()).isTrue();
      return new Map(offsetOf(object));
    };
    
    Map.kInstanceAttributesOffset = HeapObject.kSize;
    Map.kPrototypeOffset = Map.kInstanceAttributesOffset + kIntSize;
    Map.kConstructorOffset = Map.kPrototypeOffset + kPointerSize;
    Map.kInstanceDescriptorsOffset =
        Map.kConstructorOffset + kPointerSize;
    Map.kCodeCacheOffset = Map.kInstanceDescriptorsOffset + kPointerSize;
    Map.kSize = Map.kCodeCacheOffset + kIntSize;

    Map.kInstanceSizeOffset = Map.kInstanceAttributesOffset + 0;
    Map.kInstanceTypeOffset = Map.kInstanceAttributesOffset + 1;
    Map.kUnusedPropertyFieldsOffset = Map.kInstanceAttributesOffset + 2;
    Map.kBitFieldOffset = Map.kInstanceAttributesOffset + 3;

    /** @class MapWord */
    function MapWord() {
      struct.init(this, ...arguments);
    }
    
    MapWord[_].MapWord = function(value) {
      this.value_ = value;
    };

    MapWord[_].ToMap = function() {
      return struct.pointer(Map).init(null, this.value_);
    };
    
    MapWord.FromMap = function(map) {
      return new MapWord([map]);
    };
    
    struct(MapWord[_], {
      value_: u32ptr
    });

    /** @class Array */
    function Array() {
      struct.init(this, ...arguments);
    }

    Array.prototype = { constructor: Array, __proto__: HeapObject.prototype };

    Array[_].set_length = function(value) {
      WRITE_INT_FIELD(this, Array.kLengthOffset, value);
    };

    Array.kLengthOffset = HeapObject.kSize;
    Array.kHeaderSize = Array.kLengthOffset + kIntSize;

    struct(Array, {});


    /** @class FixedArray */
    function FixedArray() {
      struct.init(this, ...arguments);
    }

    FixedArray.prototype = { constructor: FixedArray, __proto__: Array.prototype };

    FixedArray.SizeFor = function(length) {
      return this.kHeaderSize + length * kPointerSize;
    };

    FixedArray.cast = function(object) {
      return new FixedArray(offsetOf(object));
    };

    struct.inheritStatic(FixedArray, Array);
    struct(FixedArray, {});

    /** @class Oddball */
    // The Oddball describes objects null, undefined, true, and false.
    function Oddball() {
      struct.init(this, ...arguments);
    }

    Oddball.prototype = { constructor: Oddball, __proto__: HeapObject.prototype };

    Oddball.cast = function(object) {
      expect(struct.type(Object).init(offsetOf(object)).IsOddball()).isTrue();
      return new Oddball(offsetOf(object));
    };

    Oddball.kToStringOffset = HeapObject.kSize;
    Oddball.kToNumberOffset = Oddball.kToStringOffset + kPointerSize;
    Oddball.kSize = Oddball.kToNumberOffset + kPointerSize;

    struct(Oddball, {});

    /** @class V8 */
    const V8 = new (function V8() {});

    V8.Initialize = function(des) {
      let create_heap_objects = (des == null);
      
      if (this.HasBeenDisposed()) return false;
      if (this.HasBeenSetup()) return true;
      this.has_been_setup_ = true;
      
      Logger.Setup();
      if (des != null)
        des.GetLog();
        
      CPU.Setup();
      OS.Setup();
      
      if (!Heap.Setup(create_heap_objects)) {
        this.has_been_setup_ = false;
        return false;
      }
      
      return true;
    };
    
    V8.HasBeenSetup = function() {
      return this.has_been_setup_;
    };
    
    V8.HasBeenDisposed = function() {
      return this.has_been_disposed_;
    };
    
    V8.has_been_setup_ = false;
    V8.has_been_disposed_ = false;

    /** @class Snapshot */
    const Snapshot = new (function Snapshot() { });
    
    Snapshot.Initialize = function(snapshot_file = null) {
      if (snapshot_file) {
        throw new Error("unimplemented");
      } else if (this.size_ > 0) {
        throw new Error("unimplemented");
      }
      return false;
    }

    Snapshot.size_ = 0;
    internal.export({ Snapshot });

    class Logger {
      static Setup() {
        return false;
      }
    }
    
    class CPU {
      static Setup() {
        // nothing to do
      }
    }

    const GetPageSize = () => {
      return 4096; // 32 bit
    };

    const OS = {};
    OS.Setup = function() { };

    OS.Allocate = function(requested, allocated, executable) {
      const msize = RoundUp(requested, GetPageSize());
      let mbase = alloc(msize);
      
      if (mbase == 0) {
        //LOG(StringEvent("OS::Allocate", "VirtualAlloc failed"));
        return 0;
      }

      allocated.value = msize;
      UpdateAllocatedSpaceLimits(mbase, msize);
      return mbase;
    };

    function Page() {
      struct.init(this, ...arguments);
    }

    Page[_].Page = function() {

    };

    Page[_].address = function() {
      return Address.init(null, offsetOf(this));
    };

    Page[_].is_valid = function() {
      return !this.address().isNullptr();
    };

    Page[_].ObjectAreaStart = function() {
      return this.address() + Page.kObjectStartOffset;
    };

    Page[_].ObjectAreaEnd = function() {
      return this.address() + Page.kPageSize;
    };

    Page[_].RSetStart = function() {
      return this.address() + Page.kRSetStartOffset;
    }

    Page[_].ClearRSet = function() {
      // new Uint8Array(buffer, this.RSetStart(), Page.kRSetEndOffset - Page.kRSetStartOffset).fill(0);
      memory(this.RSetStart(), Page.kRSetEndOffset - Page.kRSetStartOffset).setValue(0);
    };

    Page[_].next_page = function() {
      return MemoryAllocator.GetNextPage(this);
    };

    struct(Page[_], {
      opaque_header: i32,
      is_normal_page: i32,
      mc_relocation_top: Address,
      mc_page_index: i32,
      mc_first_forwarded: Address
    });

    Page.FromAddress = function(a) {
      return new Page(a & ~Page.kPageAlignmentMask);
    };

    Page.kPageSizeBits = 13;
    Page.kPageSize = 1 << Page.kPageSizeBits;
    Page.kPageAlignmentMask = (1 << Page.kPageSizeBits) - 1;
    Page.kRSetEndOffset = Page.kPageSize / kBitsPerPointer;
    Page.kRSetStartOffset = Page.kRSetEndOffset / kBitsPerPointer;
    Page.kObjectStartOffset = Page.kRSetEndOffset;
    Page.kObjectAreaSize = Page.kPageSize - Page.kObjectStartOffset;
    Page.kMaxHeapObjectSize = Page.kObjectAreaSize;

    class Malloced {
      static New(size) {
        return alloc(size);
      }
      
      static Delete(ptr) {
        free(ptr);
      }
    }
    
    class FreeStoreAllocationPolicy {
      static New(size) {
        return Malloced.New(size);
      }
      
      static Delete(ptr) {
        return Malloced.Delete(ptr);
      }
    }

    function StatsCounter() {
      struct.init(this, ...arguments);
    }

    StatsCounter[_].StatsCounter = function(name, id) {
      this.id_ = id;
      this.name_ = "c:" + name;
    };

    StatsCounter[_].Increment = function() {
      let loc = this.GetPtr();
      if (!loc.isNullptr()) loc.deref(loc.deref() + 1);
    };

    StatsCounter[_].GetPtr = function() {
      if (this.lookup_done_)
        return this.ptr_;
      this.lookup_done_ = true;
      this.ptr_ = StatsTable.FindLocation(name_);
      return this.ptr_;
    };

    struct(StatsCounter[_], {
      name_: string,
      lookup_done_: bool,
      ptr_: i32ptr,
      id_: i32
    });

    /** @class Counters */
    const Counters = new (function Counters() { });
    Counters.memory_allocated = new StatsCounter();

    /** @class ChunkInfo */
    function ChunkInfo() {
      struct.init(this, ...arguments);
    }
    
    ChunkInfo[_].ChunkInfo = function() {
      
    };

    ChunkInfo[_].address = function() {
      return this.address_;
    };
    
    ChunkInfo[_].init = function(a, s, o) {
      this.address_ = a;
      this.size_ = s;
      this.owner_ = o;
    };
    
    struct(ChunkInfo[_], {
      address_: u8ptr,
      size_: i32,
      owner_: i32ptr //owner_ PagedSpace pointer.
    });

    /** @class List */
    const List = new (function List() { });

    /** @class List<ChunkInfo> */
    List["ChunkInfo"] = function List() {
      struct.init(this, ...arguments);
    };

    List["ChunkInfo"][_].List = function(capacity) {
      this.Initialize(capacity);
    };

    List["ChunkInfo"][_].Initialize = function(capacity) {
      this.data_ = (capacity > 0) ? this.NewData(capacity) : NULL;
      this.capacity_ = capacity;
      this.length_ = 0;
    };

    List["ChunkInfo"][_].NewData = function(n) {
      return FreeStoreAllocationPolicy.New(n * sizeOf(ChunkInfo));
    };

    List["ChunkInfo"][_].Add = function(element) {
      if (this.length_ >= this.capacity_) {
        throw new Error("Unimplemented List[ChunkInfo]");
      }
      let index = this.length_.valueOf();
      this.length_++;
      return this.data_.put(index, element);
    };

    List["ChunkInfo"][_].at = function(i) {
      return this.data_.at(i);
    };

    List["ChunkInfo"][_].put = function(i, e) {
      return this.data_.put(i, e);
    };

    struct(List["ChunkInfo"][_], {
      data_: struct.pointer(ChunkInfo),
      capacity_: i32,
      length_: i32
    });

    /** @class List<int> */
    List["int"] = function List() {
      struct.init(this, ...arguments);
    };

    List["int"][_].List = function(capacity) {
      this.Initialize(capacity);
    };

    List["int"][_].Initialize = function(capacity) {
      this.data_ = (capacity > 0) ? this.NewData(capacity) : NULL;
      this.capacity_ = capacity;
      this.length_ = 0;
    };

    List["int"][_].NewData = function(n) {
      return FreeStoreAllocationPolicy.New(n * 4);
    };

    List["int"][_].Add = function(element) {
      if (this.length_ >= this.capacity_) {
        throw new Error("Unimplemented List[int]");
      }
      let index = this.length_.valueOf();
      this.length_ = index + 1;
      return this.data_.put(index, element);
    }

    List["int"][_].at = function(i) {
      return this.data_.at(i);
    };

    List["int"][_].put = function(i, e) {
      return this.data_.put(i, e);
    };

    struct(List["int"][_], {
      data_: i32ptr,
      capacity_: i32,
      length_: i32
    });

    let lowest_ever_allocated = voidptr.init(-1);
    let highest_ever_allocated = voidptr.init(0);
    
    const UpdateAllocatedSpaceLimits = (address, size) => {
      lowest_ever_allocated = Min(lowest_ever_allocated, address);
      highest_ever_allocated = Max(highest_ever_allocated, voidptr.init(address + size));
    };
    
    /** @class VirtualMemory */
    function VirtualMemory() {
      struct.init(this, ...arguments);
    }
    
    VirtualMemory[_].VirtualMemory = function(size, address_hint = 0) {
      this.address_ = alloc(size);
      this.size_ = size;
    };
    
    VirtualMemory[_].IsReserved = function() {
      return !this.address_.isNullptr();
    };
    
    VirtualMemory[_].address = function() {
      return this.address_;
    };

    VirtualMemory[_].Commit = function(address, size, executable) {
      UpdateAllocatedSpaceLimits(address, size);
      return true;
    };
    
    struct(VirtualMemory[_], {
      address_: voidptr,
      size_: i32
    });

    /** @class MemoryAllocator */
    const MemoryAllocator = new (function MemoryAllocator() { });

    MemoryAllocator.ChunkInfo = ChunkInfo;
      
    MemoryAllocator.Setup = function(capacity) {
      this.capacity_ = utils.to.i32(RoundUp(capacity, Page.kPageSize));
      this.max_nof_chunks_ = utils.to.i32((this.capacity_ / (this.kChunkSize - Page.kPageSize)) + 5);

      if (this.max_nof_chunks_ > this.kMaxNofChunks) return false;
      
      this.size_ = 0;
      
      let info = new ChunkInfo();
      for (let i = this.max_nof_chunks_ - 1; i >= 0; i--) {
        this.chunks_.Add(info);
        this.free_chunk_ids_.Add(i);
      }
      this.top_ = this.max_nof_chunks_;
      return true;
    };
    
    MemoryAllocator.ReserveInitialChunk = function(requested) {
      this.initial_chunk_ = new VirtualMemory([requested]);
      if (!this.initial_chunk_.IsReserved()) {
        free(this.initial_chunk_);
        this.initial_chunk_ = $.nullptr;
        return $.nullptr;
      }
      this.size_ = this.size_ + requested;
      return this.initial_chunk_.address();
    };

    MemoryAllocator.AllocatePages = function(requested_pages, allocated_pages, owner) {
      if (requested_pages <= 0) return Page.FromAddress(0);
      let chunk_size = stack.value(utils.to.i32(requested_pages * Page.kPageSize));

      if (this.size_ + chunk_size > this.capacity_) {
        chunk_size.set(this.capacity_ - this.size_);
        requested_pages = chunk_size >> Page.kPageSizeBits;
    
        if (requested_pages <= 0) return Page.FromAddress(0);
      }

      let chunk = this.AllocateRawMemory(chunk_size.value, chunk_size, owner.executable());

      if (chunk == 0) return Page.FromAddress(0);

      allocated_pages.value = PagesInChunk(Address.init(null, chunk), chunk_size);
      if (allocated_pages.value == 0) {
        FreeRawMemory(chunk, chunk_size);
        return Page.FromAddress(0);
      }

      let chunk_id = this.Pop();
      this.chunks_.at(chunk_id).init(Address.init(null, chunk), chunk_size.valueOf(), owner);

      return this.InitializePagesInChunk(chunk_id, allocated_pages.value, owner);
    };

    MemoryAllocator.AllocateRawMemory = function(requested, allocated, executable) {
      if (this.size_ + requested > this.capacity_) return 0;

      let mem = OS.Allocate(requested, allocated, executable);
      let alloced = allocated.value;
      this.size_ = this.size_ + alloced;
      Counters.memory_allocated.Increment(alloced);
      return mem;
    };

    MemoryAllocator.CommitPages = function(start, size, owner, num_pages) {
      num_pages.value = PagesInChunk(start, size);
      if (!this.initial_chunk_.Commit(start, size, owner.executable())) {
        return Page.FromAddress(0);
      }
      Counters.memory_allocated.Increment(size);
      let chunk_id = this.Pop();
      this.chunks_.at(chunk_id).init(start, size, owner);
      return this.InitializePagesInChunk(chunk_id, num_pages, owner);
    };

    MemoryAllocator.CommitBlock = function(start, size, executable) {
      if (!this.initial_chunk_.Commit(start, size, executable)) return false;
      Counters.memory_allocated.Increment(size);
      return true;
    };

    MemoryAllocator.Pop = function() {
      let top = this.top_;
      this.top_--;
      return this.free_chunk_ids_.at(this.top_.valueOf()).valueOf();
    };

    MemoryAllocator.InitializePagesInChunk = function(chunk_id, pages_in_chunk, owner) {
      let chunk_start = this.chunks_.at(chunk_id).address();
      let low = RoundUp(chunk_start, Page.kPageSize);

      let page_addr = low;
      for (let i = 0; i < pages_in_chunk; i++) {
        let p = Page.FromAddress(page_addr);
        p.opaque_header = OffsetFrom(page_addr + Page.kPageSize) | chunk_id;
        p.is_normal_page = 1;
        page_addr += Page.kPageSize;
      }

      let last_page = Page.FromAddress(page_addr - Page.kPageSize);
      last_page.opaque_header = OffsetFrom(0) | chunk_id;

      return Page.FromAddress(low);
    };

    MemoryAllocator.GetNextPage = function(p) {
      let raw_addr = p.opaque_header & ~Page.kPageAlignmentMask;
      return Page.FromAddress(raw_addr);
    };

    MemoryAllocator.kMaxNofChunks = 1 << Page.kPageSizeBits;
    MemoryAllocator.kPagesPerChunk = 64;
    MemoryAllocator.kChunkSize = MemoryAllocator.kPagesPerChunk * Page.kPageSize;

    MemoryAllocator.capacity_ = 0;
    MemoryAllocator.size_ = 0;
    
    //initial_chunk_ = VirtualMemory;
    
    const kEstimatedNumberOfChunks = 1049; //270;
    MemoryAllocator.chunks_ = new List["ChunkInfo"]([kEstimatedNumberOfChunks]);
    MemoryAllocator.free_chunk_ids_ = new List["int"]([kEstimatedNumberOfChunks]);

    MemoryAllocator.max_nof_chunks_ = 0;
    MemoryAllocator.top_ = 0;

    /** @class AllocationInfo */
    function AllocationInfo() {
      struct.init(this, ...arguments);      
    }

    struct(AllocationInfo[_], {
      top: Address,
      limit: Address
    });

    /** @class Space */
    function Space() {
      struct.init(this, ...arguments);
    }

    Space[_].Space = function(id, executable) {
      this.id_ = id;
      this.executable_ = executable;
    }; 

    Space[_].executable = function() {
      return this.executable_;
    };

    Space[_].identity = function() {
      return this.id_;
    };

    struct(Space[_], {
      id_: i32,
      executable_: bool
    });

    /** @class SemiSpace */
    function SemiSpace() {
      Space.call(this, ...arguments);      
    }

    SemiSpace.prototype = { constructor: SemiSpace, __proto__: Space.prototype };

    SemiSpace[_].SemiSpace = function(initial_capacity, maximum_capacity, id, executable) {
      this.Space(id, executable);
      this.capacity_ = initial_capacity;
      this.maximum_capacity_ = maximum_capacity;
    };

    SemiSpace[_].Setup = function(start, size) {
      if (!MemoryAllocator.CommitBlock(start, this.capacity_, this.executable())) {
        return false;
      }
    
      this.start_ = start;
      this.address_mask_ = ~(size - 1);
      this.object_mask_ = this.address_mask_ | kHeapObjectTag;
      this.object_expected_ = u32.init(null, start) | kHeapObjectTag;
    
      this.age_mark_ = this.start_;

      return true;
    };

    SemiSpace[_].low = function() {
      return this.start_;
    };

    SemiSpace[_].high = function() {
      return this.low() + this.capacity_;
    };

    struct(SemiSpace[_], {
      capacity_: i32,
      maximum_capacity_: i32,

      start_: Address,
      age_mark_: Address,

      address_mask_: u32,
      object_mask_: u32,
      object_expected_: u32
    });

    /** @class NewSpace */
    function NewSpace() {
      Space.call(this, ...arguments);
    }

    NewSpace.prototype = { constructor: NewSpace, __proto__: Space.prototype };

    NewSpace[_].NewSpace = function(initial_semispace_capacity, maximum_semispace_capacity, id, executable) {
      this.Space(id, executable);
      this.maximum_capacity_ = maximum_semispace_capacity;
      this.capacity_ = initial_semispace_capacity;
      this.to_space_ = new SemiSpace([this.capacity_, this.maximum_capacity_, id, executable]);
      this.from_space_ = new SemiSpace([this.capacity_, this.maximum_capacity_, id, executable]);      
    };

    NewSpace[_].Setup = function(start, size) {
      if (this.to_space_.isNullptr() || !this.to_space_.deref().Setup(start, this.maximum_capacity_)) {
        return false;
      }
      
      if (this.from_space_.isNullptr() || !this.from_space_.deref().Setup(start + this.maximum_capacity_, this.maximum_capacity_)) {
        return false;
      }

      this.start_ = start;
      this.address_mask_ = ~(size - 1);
      this.object_mask_ = this.address_mask_ | kHeapObjectTag;
      this.object_expected_ = u32.init(null, start) | kHeapObjectTag;

      this.allocation_info_.top = this.to_space_.deref().low();
      this.allocation_info_.limit = this.to_space_.deref().high();
      // this.mc_forwarding_info_.top = nullptr; // no need to execute this line
      // this.mc_forwarding_info_.limit = nullptr; // no need to execute this line

      return true;
    };

    struct(NewSpace[_], {
      capacity_: i32,
      maximum_capacity_: i32,

      to_space_: struct.pointer(SemiSpace), // SemiSpace pointer
      from_space_: struct.pointer(SemiSpace), // SemiSpace pointer,

      start_: Address,
      address_mask_: u32,
      object_mask_: u32,
      object_expected_: u32,

      allocation_info_: struct.pointer(AllocationInfo),
      mc_forwarding_info_: struct.pointer(AllocationInfo)
    });

    /** @class AllocationStats */
    function AllocationStats() {
      struct.init(this, ...arguments);
    }

    AllocationStats[_].Capacity = function() {
      return this.capacity_;
    };

    AllocationStats[_].AllocateBytes = function(size_in_bytes) {
      this.available_ -= size_in_bytes;
      this.size_ += size_in_bytes;
    };

    struct(AllocationStats[_], {
      capacity_: i32,
      available_: i32,
      size_: i32,
      waste_: i32
    });

    const PagesInChunk = (start, size) => {
      return (RoundDown(start + size, Page.kPageSize)
          - RoundUp(start, Page.kPageSize)) >> Page.kPageSizeBits;
    };

    /** @class PagedSpace */
    function PagedSpace() {
      Space.call(this, ...arguments);
    }

    PagedSpace.prototype = { constructor: PagedSpace, __proto__: Space.prototype };
    
    PagedSpace[_].PagedSpace = function(max_capacity, id, executable) {
      this.max_capacity_ = (RoundDown(max_capacity, Page.kPageSize) / Page.kPageSize) * Page.kObjectAreaSize;
    };

    PagedSpace[_].Capacity = function() {
      return this.accounting_stats_.Capacity();
    };

    PagedSpace[_].Setup = function(start, size) {
      if (this.HasBeenSetup()) return false;

      let num_pages = { value: 0, valueOf() { return this.value; } };
      
      if (PagesInChunk(start, size) > 0) {
        this.first_page_ = MemoryAllocator.CommitPages(start, size, this, num_pages);
      } else {
        let requested_pages = Min(MemoryAllocator.kPagesPerChunk,
          this.max_capacity_ / Page.kObjectAreaSize);
          this.first_page_ = MemoryAllocator.AllocatePages(requested_pages, num_pages, this);
          if (!this.first_page_.deref().is_valid()) return false;
      }

      for (let p = this.first_page_.deref(); p.is_valid(); p = p.next_page()) {
        p.ClearRSet();
      }

      this.SetAllocationInfo(this.allocation_info_, this.first_page_);

      return true;
    };

    PagedSpace[_].SetAllocationInfo = function(alloc_info, p) {
      alloc_info.top = p.deref().ObjectAreaStart();
      alloc_info.limit = p.deref().ObjectAreaEnd();
    };

    PagedSpace[_].HasBeenSetup = function() {
      return (this.Capacity() > 0);
    };

    PagedSpace[_].AllocateRaw = function(size_in_bytes) {
      let object = this.AllocateLinearly(this.allocation_info_, size_in_bytes);
      if (offsetOf(object) != 0) return object;

      object = this.SlowAllocateRaw(size_in_bytes);
      if (offsetOf(object) != 0) return object;

      return Failure.RetryAfterGC(size_in_bytes, this.identity());
    };

    PagedSpace[_].AllocateLinearly = function(alloc_info, size_in_bytes) {
      let current_top = alloc_info.top;
      let new_top = current_top + size_in_bytes;

      if (new_top > alloc_info.limit) return $.nullptr;
      alloc_info.top = new_top;
      this.accounting_stats_.AllocateBytes(size_in_bytes);
      return HeapObject.FromAddress(current_top);
    }

    struct(PagedSpace[_], {
      max_capacity_: i32,
      accounting_stats_: struct.type(AllocationStats),
      first_page_: struct.pointer(Page),
      allocation_info_: struct.type(AllocationInfo),
      mc_forwarding_info_: struct.type(AllocationInfo)
    });

    /** @class SizeNode */
    function SizeNode() {
      struct.init(this, ...arguments);
    }

    struct(SizeNode[_], {
      head_node_: Address,
      next_size_: i32
    });

    /** @class OldSpaceFressList */
    function OldSpaceFreeList() {
      struct.init(this, ...arguments);
    }

    OldSpaceFreeList[_].OldSpaceFreeList = function(owner) {
      this.owner_ = owner;
    };

    OldSpaceFreeList.kMaxBlockSize = Page.kMaxHeapObjectSize;
    OldSpaceFreeList.kFreeListsLength = OldSpaceFreeList.kMaxBlockSize / kPointerSize + 1;
    
    struct(OldSpaceFreeList[_], {
      owner_: u32,
      available_: i32,
      free_: struct.type(SizeNode).array(OldSpaceFreeList.kFreeListsLength),
      finger_: i32
    });

    /** @class OldSpace */
    function OldSpace() {
      PagedSpace.call(this, ...arguments);
    }

    OldSpace.prototype = { constructor: OldSpace, __proto__: PagedSpace.prototype };

    OldSpace[_].OldSpace = function(max_capacity, id, executable) {
      this.PagedSpace(max_capacity, id, executable);
      this.free_list_ = new OldSpaceFreeList([id]);
    };

    struct(OldSpace[_], {
      free_list_: struct.type(OldSpaceFreeList),
      mc_end_of_relocation_: Address
    });

    /** @class MapSpaceFreeList */
    function MapSpaceFreeList() {
      struct.init(this, ...arguments);
    }
    
    MapSpaceFreeList[_].MapSpaceFreeList = function(owner) {
      this.owner_ = owner;
      this.Reset();
    };
    
    MapSpaceFreeList[_].Reset = function() {
      this.available_ = 0;
      this.head_ = 0;
    }
    
    struct(MapSpaceFreeList[_], {
      available_: i32,
      head_: Address,
      owner_: i32
    });

    /** @class MapSpace */
    function MapSpace() {
      PagedSpace.call(this, ...arguments);
    }
    
    MapSpace.prototype = { constructor: MapSpace, __proto__: PagedSpace.prototype };
    
    MapSpace[_].MapSpace = function(max_capacity, id) {
      this.PagedSpace(max_capacity, id, false);
      this.free_list_ = new MapSpaceFreeList([id]);
    };
    
    MapSpace.kMapPageIndexBits = 10;
    MapSpace.kMaxMapPageIndex = (1 << MapSpace.kMapPageIndexBits) - 1;

    MapSpace.kPageExtra = Page.kObjectAreaSize % Map.kSize;
    
    struct(MapSpace[_], {
      free_list_: struct.type(MapSpaceFreeList),
      page_addresses_: Address.array(MapSpace.kMaxMapPageIndex)
    });

    /** @class LargeObjectChunk */
    function LargeObjectChunk() {
      struct.init(this, ...arguments);
    }

    struct(LargeObjectChunk[_], {
      next_: struct.pointer(LargeObjectChunk),
      size_: i32
    });

    /** @class LargeObjectSpace */
    function LargeObjectSpace() {
      Space.call(this, ...arguments);
    }

    LargeObjectSpace.prototype = { constructor: LargeObjectSpace, __proto__: Space.prototype };

    LargeObjectSpace[_].LargeObjectSpace = function(id, executable) {
      this.Space(id, executable);
    };

    LargeObjectSpace[_].Setup = function() {
      this.first_chunk_ = 0; // nullptr
      this.size_ = 0;
      this.page_count_ = 0;
      return true;
    };

    struct(LargeObjectSpace[_], {
      first_chunk_: struct.pointer(LargeObjectChunk),
      size_: i32,
      page_count_: i32
    });

    let FLAG_new_space_size = 0;
    let FLAG_old_space_size = 0;
    
    let heap_configured = false;

    const Heap = (function Heap() {});
    Heap.HasBeenSetup = function() {
      return !this.new_space_ == null &&
        !this.old_space_ == null &&
        !this.code_space_ == null &&
        !this.map_space_ == null &&
        !this.lo_space_ == null;
    }
      
    Heap.ConfigureHeap = function(semispace_size, old_gen_size) {
      if (this.HasBeenSetup()) return false;
      
      if (semispace_size > 0) this.semispace_size_ = semispace_size;
      if (old_gen_size > 0) this.old_generation_size_ = old_gen_size;
      
      this.semispace_size_ = RoundUpToPowerOf2(this.semispace_size_);
      this.initial_semispace_size_ = Min(this.initial_semispace_size_, this.semispace_size_);
      this.young_generation_size_ = 2 * this.semispace_size_;
      
      this.old_generation_size_ = RoundUp(this.old_generation_size_, Page.kPageSize);
      
      heap_configured = true;
      return true;
    }
      
    Heap.ConfigureHeapDefault = function() {
      return this.ConfigureHeap(FLAG_new_space_size, FLAG_old_space_size);
    }
      
    Heap.Setup = function(create_heap_objects) {
      if (!heap_configured) {
        if (!this.ConfigureHeapDefault()) return false;
      }

      if (!MemoryAllocator.Setup(this.MaxCapacity())) return false;
      let chunk = MemoryAllocator.ReserveInitialChunk(2 * this.young_generation_size_);
      console.log("Heap::Setup");
      if (chunk.isNullptr()) return false;
      
      let old_space_start = Address.init(null, chunk);
      let new_space_start = RoundUp(old_space_start, this.young_generation_size_);
      let code_space_start = Address.init(null, new_space_start + this.young_generation_size_);
      let old_space_size = new_space_start - old_space_start;
      let code_space_size = this.young_generation_size_ - old_space_size;
      console.log("chunk: " + 10772000 + "\nold_space_start: " + (+old_space_start),"\nnew_space_start:", new_space_start, "\ncode_space_start:",+code_space_start, "\nold_space_size:",old_space_size, "\ncode_space_size:",code_space_size);
      
      this.new_space_ = new NewSpace([this.initial_semispace_size_,
          this.semispace_size_, AllocationSpace.NEW_SPACE, false]);

      //if (this.new_space_ == null) return false; // i don't why i put this checking 
      if (!this.new_space_.Setup(new_space_start, this.young_generation_size_))
        return false;
      
      this.old_space_ = new OldSpace([this.old_generation_size_, AllocationSpace.OLD_SPACE, false]);
      //if (this.old_space_.isNullptr()) return false;
      if (!this.old_space_.Setup(old_space_start, old_space_size)) return false;
      
      this.code_space_ = new OldSpace([this.old_generation_size_, AllocationSpace.CODE_SPACE, true]);
      //if (this.code_space_.isNullptr()) return false;
      if (!this.code_space_.Setup(code_space_start, code_space_size)) return false;
      
      this.map_space_ = new MapSpace([Heap.kMaxMapSpaceSize, AllocationSpace.MAP_SPACE]);
      //if (this.map_space_.isNullptr()) return false;
      if (!this.map_space_.Setup(0, 0)) return false;

      this.lo_space_ = new LargeObjectSpace([AllocationSpace.LO_SPACE, true]);
      //if (this.lo_space_.isNullptr()) return false;
      if (!this.lo_space_.Setup()) return false;

      if (create_heap_objects) {
        if (!this.CreateInitialMaps()) return false;
        if (!CreateApiObjects()) return false;
    
        if (!CreateInitialObjects()) return false;
      }

      return true;
    }

    Heap.CreateInitialMaps = function() {
      let obj = this.AllocatePartialMap(InstanceType.MAP_TYPE, Map.kSize);
      if (obj.IsFailure()) return false;

      this.meta_map_ = struct.pointer(Map).init(null, offsetOf(obj));
      struct["*"](this.meta_map()).set_map(this.meta_map());

      obj = this.AllocatePartialMap(InstanceType.FIXED_ARRAY_TYPE, Array.kHeaderSize);
      if (obj.IsFailure()) return false;
      this.fixed_array_map_ = Map.cast(obj);

      obj = this.AllocatePartialMap(InstanceType.ODDBALL_TYPE, Oddball.kSize);
      if (obj.IsFailure()) return false;
      this.oddball_map_ = Map.cast(obj);

      obj = this.AllocateEmptyFixedArray();
      if (obj.IsFailure()) return false;
      this.empty_fixed_array_ = FixedArray.cast(obj);
      
      obj = this.Allocate(this.oddball_map(), AllocationSpace.CODE_SPACE);
      if (obj.IsFailure()) return false;
      null_value_ = obj;

      return true;
    };

    Heap.AllocatePartialMap = function(instance_type, instance_size) {
      let result = this.AllocateRawMap(Map.kSize);
      if (result.IsFailure()) return result;

      let map = new Map(offsetOf(result));
      map.set_map(this.meta_map());
      map.set_instance_type(instance_type);
      map.set_instance_size(instance_size);
      map.set_unused_property_fields(0);
      return result;
    };

    Heap.AllocateRawMap = function(size_in_bytes) {
      let result = this.map_space_.AllocateRaw(size_in_bytes);
      if (result.IsFailure()) this.old_gen_exhausted_ = true;
      return result;
    };

    Heap.AllocateEmptyFixedArray = function() {
      let size = FixedArray.SizeFor(0);
      let result = this.AllocateRaw(size, AllocationSpace.CODE_SPACE);
      if (result.IsFailure()) return result;

      let array = new Array(offsetOf(result));
      array.set_map(this.fixed_array_map());
      array.set_length(0);
      return result;
    };

    Heap.AllocateRaw = function(size_in_bytes, space) {
      if (AllocationSpace.NEW_SPACE == space) {
        return this.new_space_.AllocateRaw(size_in_bytes);
      }

      let result = null;
      if (AllocationSpace.OLD_SPACE == space) {
        result = this.old_space_.AllocateRaw(size_in_bytes);
      } else if (AllocationSpace.CODE_SPACE == space) {
        result = this.code_space_.AllocateRaw(size_in_bytes);
      } else if (AllocationSpace.LO_SPACE == space) {
        result = this.lo_space_.AllocateRaw(size_in_bytes);
      } else {
        //ASSERT(AllocationSpace.MAP_SPACE == space);
        result = map_space_.AllocateRaw(size_in_bytes);
      }
      if (result.IsFailure()) this.old_gen_exhausted_ = true;
      return result;
    };

    Heap.Allocate = function(map, space) {
      let result = this.AllocateRaw(map.instance_size(), space);
      if (result.IsFailure()) return result;
      HeapObject.cast(result).set_map(offsetOf(map));
      return result;
    };

    Heap.MaxCapacity = function() {
      return this.young_generation_size_ + this.old_generation_size_;
    }

    Heap.meta_map = function() {
      return this.meta_map_;
    };

    Heap.fixed_array_map = function() {
      return this.fixed_array_map_;
    };

    Heap.oddball_map = function() {
      return Heap.oddball_map_;
    };

    Heap.semispace_size_ = 0;
    Heap.initial_semispace_size_ = 0;
    Heap.young_generation_size_ = 0;
    Heap.old_generation_size_ = 0;
      
    Heap.new_space_growth_limit_ = 0;
    Heap.scavenge_count_ = 0;
    Heap.kMaxMapSpaceSize = 0;
      
    Heap.new_space_ = null;
    Heap.old_space_ = null;
    Heap.code_space_ = null;
    Heap.map_space_ = null;
    Heap.lo_space_ = null;

    Heap.old_gen_exhausted_ = 0;
    Heap.meta_map_ = struct.pointer(Map).init();
    Heap.fixed_array_map_ = struct.pointer(Map).init();
    Heap.oddball_map_ = struct.pointer(Map).init();

    Heap.kMaxMapSpaceSize = 8*MB;
    Heap.semispace_size_  = 1*MB;
    Heap.old_generation_size_ = 512*MB;
    Heap.initial_semispace_size_ = 256*KB;

    internal.export({ V8, Page, MemoryAllocator });
    v8.export({ internal });
  }); // namespace internal

  const i = internal;
  
  class Utils {
    static ReportApiFailure(location, message) {
      let callback = GetFatalErrorHandler();
      callback(location, message);
      has_shut_down = true;
      return false;
    }
  }
  
  const API_FATAL = (location, message, ...args) => {
    let message_arr = ["\n#\n# Fatal error in " + location + "\n# "];
    message_arr.push(args.length > 0 ? args[0] : "");
    message_arr.push("\n#\n\n");
    throw new Error(message_arr.join(""));
  };
  
  let has_shut_down = false;
  let exception_behavior = null;
  
  const DefaultFatalErrorHandler = (location, message) => {
    API_FATAL(location, message);
  };

  const GetFatalErrorHandler = () => {
    if (exception_behavior == null) {
      exception_behavior = DefaultFatalErrorHandler;
    }
    return exception_behavior;
  };
  
  const ApiCheck = (condition, location, message) => {
    return condition ? true : Utils.ReportApiFailure(location, message);
  };
  
  const ReportV8Dead = (location) => {
    let callback = GetFatalErrorHandler();
    callback(location, "V8 is no longer useable");
    return true;
  };

  const IsDeadCheck = (location) => {
    return has_shut_down ? ReportV8Dead(location) : false;
  };
  
  const EnsureInitialized = (location) => {
    if (IsDeadCheck(location)) return;
    ApiCheck(v8.V8.Initialize(), location, "Error initializing V8");
  };

  
  const Handle = new (function Handle() { });

  /** @class Handle<FunctionTemplate> */
  Handle["FunctionTemplate"] = function Handle() {
    $[0](this, ...arguments);
  };
  
  /** @class Handle<ObjectTemplate> */
  Handle["ObjectTemplate"] = function Handle() {
    $[0](this, ...arguments);
  };

  const Local = new (function Local() {});
  /** @class Local<FunctionTemplate> */
  Local["FunctionTemplate"] = function Local() {
    
  };

  /** @class Local<ObjectTemplate> */
  Local["ObjectTemplate"] = function Local() {
    
  };

  class V8 {
    static SetFlagsFromCommandLine(argc, argv, remove_flags) {
      i.FlagList.SetFlagsFromCommandLine(argc, argv, remove_flags);
    }
    
    static Initialize() {
      if (i.V8.HasBeenSetup()) return true;
      let scope = new HandleScope();
      if (i.Snapshot.Initialize()) {
        i.Serializer.disable();
        return true;
      } else {
        return i.V8.Initialize(null);
      }
    }
  }

  v8.export({ V8 });

  function HandleScope() {
    struct.init(this, ...arguments);
  }

  HandleScope.Data = function Data() {
    struct.init(this, ...arguments);
  };

  HandleScope.Data[_].Initialize = function() {
    this.extensions = -1;
    this.next = this.limit = nullptr;
  };

  struct(HandleScope.Data[_], {
    extensions: i32,
    next: voidptr,
    limit: voidptr
  });

  HandleScope[_].HandleScope = function() {
    this.previous_ = HandleScope.current_;
    this.is_closed_ = false;
    HandleScope.current_.extensions = 0;
  };

  struct(HandleScope[_], {
    previous_: struct.type(HandleScope.Data),
    is_closed_: bool
  });

  HandleScope.current_ = struct.type(HandleScope.Data).init();

  class Data {
    constructor() {
      struct.init(this, ...arguments);
    }
  }

  class Template extends Data {
    constructor() {
      super(...arguments);
    }
  }

  class FunctionTemplate extends Template {
    constructor() {
      super(...arguments);
    }
  }

  class ObjectTemplate extends Template {
    static New(constructor) {
      if (constructor == undefined)
        constructor = new Local["FunctionTemplate"]();
      if (IsDeadCheck("v8::ObjectTemplate::New()"))
        return new Local["ObjectTemplate"]();
      EnsureInitialized("v8::ObjectTemplate::New()");
    }
    
    constructor() {
      super(...arguments);
    }
  }

  v8.export({ ObjectTemplate });
  
  v8.export({ Handle, HandleScope });
});

const main = (args) => {
  v8.V8.SetFlagsFromCommandLine(args.length, args, true);
  let handle_scope = new v8.HandleScope([]);
  let global = v8.ObjectTemplate.New();
  //console.log(handle_scope, global);
};
main([]);
debugger;