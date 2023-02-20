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
    expect(func[sSize]).typeIs("number");

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

  function toAddress(value) {
    if (typeof value == "number")
      return value;
    if (value instanceof Pointer)
      return load.u32(value[sOffset]);
    let addr = 0;
    if (typeof value == "object" && typeof (addr = value[sOffset]) == "number")
      return addr;
    throw new TypeError("Unable to convert 'value' to address.");
  }

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
    if (this.isNullptr()) throw new Error("Unable to dereference a null pointer.");
    if (value != undefined) {
      if (this[sDepth] > 1) {
        if (value instanceof Pointer) {
          if ((this[sDepth] - 1) != value[sDepth])
            throw new Error("Invalid pointer.");
          store.u32(this[sOffset], value[sOffset]);
        }
      }
      return value;
    } else {
      if (this[sDepth] == 1)
        return new this[sCtor](load.u32(this[sOffset]));
      return new Pointer(this[sCtor], this[sDepth] - 1, load.u32(this[sOffset]));
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

  const string = new Type(StringUtf8);
  const stringptr = new Type(StringUtf8, 1);
  const stringptrptr = new Type(StringUtf8, 2);

  const equals = (obj1, obj2) => {
    if (obj1 instanceof Pointer && obj2 instanceof Pointer)
      return obj1[sOffset] == obj2[sOffset] && obj1[sCtor] == obj2[sCtor]
        && obj1[sDepth] == obj2[sDepth];

  };

  const i32 = new Type(Int32);
  const i32ptr = new Type(Int32, 1);
  const i32ptrptr = new Type(Int32, 2);
  return { Type, Pointer, load, store, i32, i32ptr, i32ptrptr, voidptr, voidptrptr, char, charptr, charptrptr, string, stringptr, stringptrptr };
});

let i = std.i32.init(0, 1024);
let i0 = std.i32ptr.init(0, i);
let i1 = std.i32ptrptr.init(0, i0);

debugger;