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

  function roundup(num, r) {
    return (num + r - 1) & -r;
  }

  function defineConst(object, name, value) {
    Object.defineProperty(object, name, {
      value,
      enumerable: true,
      configurable: false,
      writable: false,
    });
  }

  function defineNonEnum(object, name, value) {
    Object.defineProperty(object, name, {
      value,
      enumerable: false,
      configurable: false,
      writable: false,
    });
  }

  const sOffset = Symbol("offset");
  const sLength = Symbol("length");

  const sId = Symbol("id");
  let funcId = 1;

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

  const copyBytes = (src, dest, size) => {
    new Int8Array(buffer, dest, size).set(new Int8Array(buffer, src, size));
  };
  
  const sizeOf = (obj) => {
    return obj[sLength];
  };

  function toVoidptr(offset) {
    return new PointRef(Void, offset);
  }

  function isPrimitiveValue(value) {
    return typeof value == "string" ||
      typeof value == "number" || typeof value == "boolean";
  }

  function Void(offset) {
    defineNonEnum(this, sOffset, +offset);
    defineNonEnum(this, sLength, 0);
  }
  
  Void.prototype.valueOf = function() {
    return null;
  };

  defineNonEnum(Void, sLength, 0);
  defineNonEnum(Void, sId, funcId++);

  function Uint8(offset, value) {
    defineNonEnum(this, sOffset, +offset);
    if (value != undefined)
      u8(this[sOffset], value);
  }

  Uint8.prototype.valueOf = function() {
    return u8(this[sOffset]);
  };

  defineNonEnum(Uint8, sLength, 1);
  defineNonEnum(Uint8, sId, funcId++);

  function Int32(offset, value) {
    defineNonEnum(this, sOffset, +offset);
    if (value != undefined)
      i32(this[sOffset], value);
  }

  Int32.prototype.valueOf = function() {
    return i32(this[sOffset]);
  };

  defineNonEnum(Int32, sLength, 4);
  defineNonEnum(Int32, sId, funcId++);

  function Uint32(offset, value) {
    defineNonEnum(this, sOffset, +offset);
    if (value != undefined)
      u32(this[sOffset], value);
  }

  Uint32.prototype.valueOf = function() {
    return u32(this[sOffset]);
  };

  defineNonEnum(Uint32, sLength, 4);
  defineNonEnum(Uint32, sId, funcId++);

  function Bool(offset, value) {
    defineNonEnum(this, sOffset, +offset);
    defineNonEnum(this, sLength, 1);

    if (value != undefined)
      u8(this[sOffset], value || value > 0 ? 1 : 0);
  }

  Bool.prototype.valueOf = function() {
    return u8(this[sOffset]) == 1 ? true : false;
  };

  defineNonEnum(Bool, sLength, 1);
  defineNonEnum(Bool, sId, funcId++);

  function Float32(offset, value) {
    defineNonEnum(this, sOffset, +offset);
    defineNonEnum(this, sLength, 4);

    if (value != undefined)
      f32(this[sOffset], value);
  }

  Float32.prototype.valueOf = function() {
    return f32(this[sOffset]);
  };

  defineNonEnum(Float32, sLength, 4);
  defineNonEnum(Float32, sId, funcId++);

  function Char(offset, value) {
    defineNonEnum(this, sOffset, +offset);
    defineNonEnum(this, sLength, 1);
    if (value != undefined)
      u8(this[sOffset], typeof value == "string"
        ? value.charCodeAt(0) : value);
  }

  Char.prototype.toString = function() {
    return String.fromCharCode(this.valueOf());
  };

  Char.prototype.valueOf = function() {
    return u8(this[sOffset]);
  };

  defineNonEnum(Char, sLength, 1);
  defineNonEnum(Char, sId, funcId++);

  function StringUtf8(offset, value) {
    defineNonEnum(this, sOffset, +offset);
    defineNonEnum(this, sLength, 4);

    if (value == undefined) return;
    let str_len = value.length;
    let str_offset = alloc(roundup(str_len + 4, 4));
    u32(str_offset, str_len);
    u32(this[sOffset], str_offset);

    for (let index = 0; index < str_len; index++) {
      u8(str_offset + 4 + index, value.charCodeAt(index));
    }
  }

  StringUtf8.prototype.toString = function() {
    let str_offset = u32(this[sOffset]);
    let str_len = u32(str_offset);
    let str_arr = [];

    for (let index = 0; index < str_len; index++) {
      str_arr.push(String.fromCharCode(u8(str_offset + 4 + index)));
    }
    return str_arr.join("");
  };

  defineNonEnum(StringUtf8, sLength, 4);
  defineNonEnum(StringUtf8, sId, funcId++);
  
  function PointRef(func, offset, deep = 1, isPrimitiveType = false) {
    console.assert(deep > 0, "invalid pointer deepness");
    defineNonEnum(this, sOffset, offset);
    defineNonEnum(this, sLength, 4);
    //this.offset = offset;
    //this.length = 4;
    this.deref = function(value) {
      let ptr = u32(offset);
      if (ptr == 0)
        throw new Error("Unable to dereference a null pointer.");

      if (value != undefined) {
        if (deep == 1)
          if (isPrimitiveType && isPrimitiveValue(value)) {
            func.call({}, ptr, value);
            return value;
          }
        
        u32(offset, isPrimitiveValue(value) ? value : value[sOffset]);
        return value;
      }

      if ((deep - 1) == 0)
        return new func(toVoidptr(ptr));
      else
        return new PointRef(func, ptr, deep - 1);
    };

    this.at = function(index) {
      let ptr = u32(offset);
      if (ptr == 0)
        throw new Error("Unable to dereference a null pointer.");
      if (deep == 1)
        return new func(toVoidptr(ptr + (index * func[sLength])));
      else
        return new PointRef(func, ptr + (index * func[sLength]), deep - 1);
    };

    this.put = function(index, value) {
      let ptr = u32(offset);
      if (ptr == 0)
        throw new Error("Unable to assign value to a null pointer.");
      if (deep == 1) {
        if (isPrimitiveType && isPrimitiveValue(value))
          func.call({}, ptr + (index * func[sLength]), value);
        else
          copyBytes(value[sOffset], ptr + (index * func[sLength]), func[sLength]);
      } else {
        u32(ptr + (index * func[sLength]), value[sOffset]);
      }
      return value;
    };

    this.isNullptr = function() {
      return u32(offset) == 0;
    };
  }

  PointRef.prototype.valueOf = function() {
    return u32(this[sOffset]);
  };

  let nullptr = toVoidptr(0);
  
  function ArrayRef(type, offset, length) {
    //this.offset = offset;
    defineNonEnum(this, sOffset, offset);
    defineNonEnum(this, sLength, type.size * length);
    defineNonEnum(this, "length", length);
    this.at = function(index) {
      if (index >= length)
        throw new Error("Out of bounds array index: " + index);
      return type.init(offset + (index * type.size));
    };
    
    this.put = function(index, value) {
      if (index >= length)
        throw new Error("Out of bounds array index: " + index);
      return type.set(offset + (index * type.size), value);
    };
  }

  function Type(func, ptr) {
    let size = ptr > 0 ? pointer_size : func[sLength];
    let isPrimitiveType = func[sId] >= 1 && func[sId] <= 10;
    
    this.init = function(offset, value) {
      if (offset == null)
          offset = alloc(size);
      if (ptr > 0) {
        if (value != undefined)
          if (value instanceof PointRef)
            u32(offset, u32(value[sOffset]));
          else
            u32(offset, typeof value == "number" ? value : value[sOffset]);
        return new PointRef(func, offset, ptr, isPrimitiveType);
      } else {
        if (value != undefined)
          if (isPrimitiveType)
            return new func(offset, value);
          else
            new Uint8Array(buffer, offset, size).set(new Uint8Array(buffer, value[sOffset], size));
        return new func(offset);
      }
    };
    
    Object.defineProperty(this, "size", {
      get() { return size; },
      enumerable: true,
      configurable: false
    });

    this.array = function(length) {
      return new TypeArray(this, length);
    };
    
    this.bitfield = function(bits) { };
  }
  
  function TypeArray(type, length) {
    this.length = length;
    this.size = length * type.size;
    this.init = function(offset) {
      return new ArrayRef(type, offset, length);
    };

    this.set = function(offset, value) {
      
    };
  }

  function type(func, ptr = "") {
    return new Type(func, ptr.length);
  }

  function typeCheck() {

  }

  function getGetterSetter(type, offset) {
    return {
      get() {
        return type.init(this[sOffset] + offset);
      },
      set(value) {
        return type.init(this[sOffset] + offset, value);
      }
    };
  }
  
  function getStaticGetterSetter(type, offset) {
    return {
      get() { return type.init(offset); },
      set(value) { return type.init(offset, value); }
    };
  }
  
  const $ = { type , __proto__: null };
  $.bool = type(Bool);
  $.u8 = type(Uint8);
  $.u8ptr = type(Uint8, "*");
  $.int = type(Int32);
  $.i32 = $.int;
  $.i32ptr = $.type(Int32, "*"),
  $.u32 = $.type(Uint32);
  $.u32ptr = $.type(Uint32, "*");
  $.f32 = type(Float32);
  $.f32ptr = type(Float32, "*");
  $.float = $.f32;
  $.string = type(String);
  $.char = type(Char);
  $.voidptr = type(Void, "*");
  $.nullptr = nullptr;
  
  $.ptr = function(func) {
    return type(func, "*");
  };
  
  $.ptrptr = function(func) {
    return type(func, "**");
  };

  const stack = new (function Stack() {});
  $.$stack = stack;

  stack.value = function(value) {
    return { value, valueOf() { return this.value; } };
  };
  
  function defineInstanceProp(obj, offset, length) {
    defineNonEnum(obj, sOffset, offset);
    defineNonEnum(obj, sLength, length);
  }
  
  $[0] = function(object, pointer, args) {
    let constructor = object[object.constructor.name] || function() { };
    let size = object.constructor[sLength];
    
    if (pointer == undefined) {
      pointer = toVoidptr(alloc(size));
      args = [];
    }
    
    if (pointer instanceof PointRef || typeof pointer == "number") {
      defineInstanceProp(object, typeof pointer == "number" ? pointer : pointer[sOffset], size);
      if (Array.isArray(args)) {
        constructor.apply(object, args);
      }
      return;
    }

    if (Array.isArray(pointer)) {
      args = pointer;
      pointer = alloc(size);
      defineInstanceProp(object, pointer, size);
      constructor.apply(object, args);
      return;
    }
    throw new Error("Invalid arguments.");
  };

  $[1] = function(obj, prop, isUnion = false) {
    let offset = Object.getPrototypeOf(obj).constructor[sLength] || 0;
    let size = 0;
    let sizes = [8,4,2];
    for (let name in prop) {
      let type = prop[name];
      typeCheck(type);
      
      for (let index = 0; index < 3; index++) {
        let modulo = sizes[index];
        if (type.size % modulo == 0 && offset % modulo != 0 && type.size == modulo) {
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
      
      !isUnion ? offset += type.size: size = Math.max(offset, size);
    }

    defineNonEnum(obj.constructor, sLength, !isUnion ? roundup(offset, 4) : roundup(size, 4));
    defineNonEnum(obj.constructor, sId, funcId++);
  };

  $.struct = $[1];
  
  $[2] = function(obj, prop, isUnion = false) {
    let sizes = [8,4,2];
    for (let name in prop) {
      let type = prop[name];
      typeCheck(type);

      let offset = alloc(type.size);
      
      for (let index = 0; index < 3; index++) {
        let modulo = sizes[index];
        if (type.size % modulo == 0 && offset % modulo != 0 && type.size == modulo) {
          offset = roundup(offset, modulo);
          break;
        }
      }
      
      let getset = getStaticGetterSetter(type, offset);
      Object.defineProperty(obj, name, {
        get: getset.get,
        set: getset.set,
        enumerable: true,
        configurable: false
      });
    }
  };

  $.embed = $[2];


const v8 = namespace((v8) => {
  const _ = "prototype";
  const { u8, u8ptr, i32, i32ptr, u32, u32ptr, char, f32, string, bool, struct, voidptr, $stack } = $;
  const $type = $.type;
  const $ptr = $.ptr;
  
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
    
    const Address = $.u8ptr;

    function FlagValue() {
      $[0](this, ...arguments);
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
      f: f32,
      s: string
    });
    

    function Flag() {
      $[0](this, ...arguments);
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
      variable_: $.type(FlagValue, "*"),
      default_: $.type(FlagValue),
      
      next_: $.type(Flag, "*") // Flag pointer
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

    function FlagList() {
      $[0](this, ...arguments);
    }
    
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
    
    $[2](FlagList, {
      list_: $type(Flag, "*")
    });
    
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
    
    function Object() {
      $[0](this, ...arguments);
    }

    Object[_].IsFailure = function() {
      return (this[sOffset] & kFailureTagMask) == kFailureTag;
    };
    
    Object.kSize = 0;
    
    function HeapObject() {
      Object.call(this, ...arguments);
    }
    
    HeapObject.prototype = { constructor: HeapObject, __proto__: Object.prototype };

    HeapObject[_].set_map = function(value) {
      this.set_map_word(MapWord.FromMap(value));
    };

    HeapObject.FromAddress = function(address) {
      return new HeapObject(toVoidptr(address + kHeapObjectTag));
    };
    
    HeapObject.kMapOffset = Object.kSize;
    HeapObject.kSize = HeapObject.kMapOffset + kPointerSize;
    
    function Map() {
      HeapObject.call(this, ...arguments);
    }
    
    Map.prototype = { constructor: Map, __proto__: HeapObject.prototype };
    
    Map.kInstanceAttributesOffset = HeapObject.kSize;
    Map.kPrototypeOffset = Map.kInstanceAttributesOffset + kIntSize;
    Map.kConstructorOffset = Map.kPrototypeOffset + kPointerSize;
    Map.kInstanceDescriptorsOffset =
        Map.kConstructorOffset + kPointerSize;
    Map.kCodeCacheOffset = Map.kInstanceDescriptorsOffset + kPointerSize;
    Map.kSize = Map.kCodeCacheOffset + kIntSize;
    
    function MapWord() {
      $[0](this, ...arguments);
    }
    
    MapWord[_].MapWord = function(value) {
      this.value_ = value;
    };
    
    MapWord.FromMap = function(map) {
      return new MapWord(map[sOffset]);
    };
    
    struct(MapWord[_], {
      value_: u32ptr
    });
    
    function V8() {
      $[0](this, ...arguments);
    }
    
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

    function Snapshot() {
      $[0](this, ...arguments);
    }
    
    Snapshot.Initialize = function(snapshot_file = null) {
      if (snapshot_file) {
        throw new Error("unimplemented");
      } else if (this.size_ > 0) {
        throw new Error("unimplemented");
      }
      return false;
    }

    $[2](Snapshot, {
      size_: i32
    });
    
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
        return $.nullptr;
      }

      allocated.value = msize;
      UpdateAllocatedSpaceLimits(mbase, msize);
      return mbase;
    };

    function Page() {
      $[0](this, ...arguments);
    }

    Page[_].Page = function() {

    };

    Page[_].address = function() {
      return Address.init(this[sOffset]);
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
      new Uint8Array(buffer, this.RSetStart(), Page.kRSetEndOffset - Page.kRSetStartOffset).fill(0);
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
      return new Page(toVoidptr(a & ~Page.kPageAlignmentMask));
    };
    /*
    $[2](Page, {
      kPageSizeBits: i32,
      kPageSize: i32,
      kPageAlignmentMask: i32,
      kRSetEndOffset: i32,
      kRSetStartOffset: i32,
      kObjectStartOffset: i32,
      kObjectAreaSize: i32,
      kMaxHeapObjectSize: i32
    });*/

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
      $[0](this, ...arguments);
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

    const Counters = new (function Counters() { });
    $[2](Counters, {
      memory_allocated: $type(StatsCounter)
    });
    
    
    function ChunkInfo() {
      $[0](this, ...arguments);
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

    const List = new (function List() { });

    List["ChunkInfo"] = function List() {
      $[0](this, ...arguments);
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
      this.length_ = index + 1;
      return this.data_.put(index, element);
    };

    List["ChunkInfo"][_].at = function(i) {
      return this.data_.at(i);
    };

    List["ChunkInfo"][_].put = function(i, e) {
      return this.data_.put(i, e);
    };

    struct(List["ChunkInfo"][_], {
      data_: $ptr(ChunkInfo),
      capacity_: i32,
      length_: i32
    });

    List["int"] = function List() {
      $[0](this, ...arguments);
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

    let lowest_ever_allocated = toVoidptr(-1);
    let highest_ever_allocated = toVoidptr(0);
    
    const UpdateAllocatedSpaceLimits = (address, size) => {
      lowest_ever_allocated = Min(lowest_ever_allocated, address);
      highest_ever_allocated = Max(highest_ever_allocated, toVoidptr(address + size));
    };
    
    function VirtualMemory() {
      $[0](this, ...arguments);
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

    function MemoryAllocator() {
      $[0](this, ...arguments);
    }
    
    MemoryAllocator.ChunkInfo = ChunkInfo;
      
    MemoryAllocator.Setup = function(capacity) {
      this.capacity_ = RoundUp(capacity, Page.kPageSize);
      this.max_nof_chunks_ = (this.capacity_ / (this.kChunkSize - Page.kPageSize)) + 5;

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
      if (!this.initial_chunk_.deref().IsReserved()) {
        free(this.initial_chunk_);
        this.initial_chunk_ = $.nullptr;
        return $.nullptr;
      }
      this.size_ = this.size_ + requested;
      return this.initial_chunk_.deref().address();
    };

    MemoryAllocator.AllocatePages = function(requested_pages, allocated_pages, owner) {
      if (requested_pages <= 0) return Page.FromAddress($.nullptr);
      let chunk_size = $stack.value(parseInt(requested_pages * Page.kPageSize));

      if (this.size_ + chunk_size > this.capacity_) {
        chunk_size = this.capacity_ - this.size_;
        requested_pages = chunk_size >> Page.kPageSizeBits;
    
        if (requested_pages <= 0) return Page.FromAddress($.nullptr);
      }

      let chunk = this.AllocateRawMemory(chunk_size.value, chunk_size, owner.executable());

      if (chunk == 0) return Page.FromAddress($.nullptr);

      allocated_pages.value = PagesInChunk(Address.init(null, chunk), chunk_size);
      if (allocated_pages.value == 0) {
        FreeRawMemory(chunk, chunk_size);
        return Page.FromAddress($.nullptr);
      }

      let chunk_id = this.Pop();
      this.chunks_.at(chunk_id).init(Address.init(null, chunk), chunk_size, owner);

      return this.InitializePagesInChunk(chunk_id, allocated_pages.value, owner);
    };

    MemoryAllocator.AllocateRawMemory = function(requested, allocated, executable) {
      if (this.size_ + requested > this.capacity_) return $.nullptr;

      let mem = OS.Allocate(requested, allocated, executable);
      let alloced = allocated.value;
      this.size_ = this.size_ + alloced;
      Counters.memory_allocated.Increment(alloced);
      return mem;
    };

    MemoryAllocator.CommitPages = function(start, size, owner, num_pages) {
      num_pages.value = PagesInChunk(start, size);
      if (!this.initial_chunk_.deref().Commit(start, size, owner.executable())) {
        return Page.FromAddress(nullptr);
      }
      Counters.memory_allocated.Increment(size);
      let chunk_id = this.Pop();
      this.chunks_.at(chunk_id).init(start, size, owner);
      return this.InitializePagesInChunk(chunk_id, num_pages, owner);
    };

    MemoryAllocator.CommitBlock = function(start, size, executable) {
      if (!this.initial_chunk_.deref().Commit(start, size, executable)) return false;
      Counters.memory_allocated.Increment(size);
      return true;
    };

    MemoryAllocator.Pop = function() {
      let top = this.top_.valueOf();
      this.top_ = top - 1;
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
      
    $[2](MemoryAllocator, {
      kMaxNofChunks: i32,
      kPagesPerChunk: i32,
      kChunkSize: i32,
      capacity_: i32,
      size_: i32,
      
      initial_chunk_: $.ptr(VirtualMemory),
      
      chunks_: $type(List["ChunkInfo"]),
      free_chunk_ids_: $type(List["int"]),
      max_nof_chunks_: i32,
      top_: i32
    });
    
    MemoryAllocator.kMaxNofChunks = 1 << Page.kPageSizeBits;
    MemoryAllocator.kPagesPerChunk = 64;
    MemoryAllocator.kChunkSize = MemoryAllocator.kPagesPerChunk * Page.kPageSize;
    
    const kEstimatedNumberOfChunks = 1049; //270;
    MemoryAllocator.chunks_ = new List["ChunkInfo"]([kEstimatedNumberOfChunks]);
    MemoryAllocator.free_chunk_ids_ = new List["int"]([kEstimatedNumberOfChunks]);

    function AllocationInfo() {
      $[0](this, ...arguments);      
    }

    struct(AllocationInfo[_], {
      top: Address,
      limit: Address
    });
    
    function Space() {
      $[0](this, ...arguments);
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

      to_space_: $ptr(SemiSpace), // SemiSpace pointer
      from_space_: $ptr(SemiSpace), // SemiSpace pointer,

      start_: Address,
      address_mask_: u32,
      object_mask_: u32,
      object_expected_: u32,

      allocation_info_: $type(AllocationInfo),
      mc_forwarding_info_: $type(AllocationInfo)
    });

    function AllocationStats() {
      $[0](this, ...arguments);
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
      if (object != $.nullptr) return object;

      object = this.SlowAllocateRaw(size_in_bytes);
      if (object != $.nullptr) return object;

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
      accounting_stats_: $type(AllocationStats),
      first_page_: $ptr(Page),
      allocation_info_: $type(AllocationInfo),
      mc_forwarding_info_: $type(AllocationInfo)
    });

    function SizeNode() {
      $[0](this, ...arguments);
    }

    struct(SizeNode[_], {
      head_node_: Address,
      next_size_: i32
    });

    function OldSpaceFreeList() {
      $[0](this, ...arguments);
    }

    OldSpaceFreeList[_].OldSpaceFreeList = function(owner) {
      this.owner_ = owner;
    };

    OldSpaceFreeList.kMaxBlockSize = Page.kMaxHeapObjectSize;
    OldSpaceFreeList.kFreeListsLength = OldSpaceFreeList.kMaxBlockSize / kPointerSize + 1;
    
    struct(OldSpaceFreeList[_], {
      owner_: u32,
      available_: i32,
      free_: $type(SizeNode).array(OldSpaceFreeList.kFreeListsLength),
      finger_: i32
    });
    
    function OldSpace() {
      PagedSpace.call(this, ...arguments);
    }

    OldSpace.prototype = { constructor: OldSpace, __proto__: PagedSpace.prototype };

    OldSpace[_].OldSpace = function(max_capacity, id, executable) {
      this.PagedSpace(max_capacity, id, executable);
      this.free_list_ = new OldSpaceFreeList([id]);
    };

    struct(OldSpace[_], {
      free_list_: $type(OldSpaceFreeList),
      mc_end_of_relocation_: Address
    });
    
    function MapSpaceFreeList() {
      $[0](this, ...arguments);
    }
    
    MapSpaceFreeList[_].MapSpaceFreeList = function(owner) {
      this.owner_ = owner;
      this.Reset();
    };
    
    MapSpaceFreeList[_].Reset = function() {
      this.available_ = 0;
      this.head_ = $.nullptr;
    }
    
    struct(MapSpaceFreeList[_], {
      available_: i32,
      head_: Address,
      owner_: i32
    });
    
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
      free_list_: $type(MapSpaceFreeList),
      page_addresses_: Address.array(MapSpace.kMaxMapPageIndex)
    });

    function LargeObjectChunk() {
      $[0](this, ...arguments);
    }

    struct(LargeObjectChunk[_], {
      next_: $ptr(LargeObjectChunk),
      size_: i32
    });
    
    function LargeObjectSpace() {
      Space.call(this, ...arguments);
    }

    LargeObjectSpace.prototype = { constructor: LargeObjectSpace, __proto__: Space.prototype };

    LargeObjectSpace[_].LargeObjectSpace = function(id, executable) {
      this.Space(id, executable);

    };

    LargeObjectSpace[_].Setup = function() {
      this.first_chunk_ = $.nullptr;
      this.size_ = 0;
      this.page_count_ = 0;
      return true;
    };

    struct(LargeObjectSpace[_], {
      first_chunk_: $ptr(LargeObjectChunk),
      size_: i32,
      page_count_: i32
    });

    let FLAG_new_space_size = 0;
    let FLAG_old_space_size = 0;
    
    let heap_configured = false;

    const Heap = (function Heap() {});
    Heap.HasBeenSetup = function() {
      return !this.new_space_.isNullptr() &&
        !this.old_space_.isNullptr() &&
        !this.code_space_.isNullptr() &&
        !this.map_space_.isNullptr() &&
        !this.lo_space_.isNullptr();
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

      if (this.new_space_.isNullptr()) return false; // i don't why i put this checking 
      if (!this.new_space_.deref().Setup(new_space_start, this.young_generation_size_))
        return false;
      
      this.old_space_ = new OldSpace([this.old_generation_size_, AllocationSpace.OLD_SPACE, false]);
      if (this.old_space_.isNullptr()) return false;
      if (!this.old_space_.deref().Setup(old_space_start, old_space_size)) return false;
      
      this.code_space_ = new OldSpace([this.old_generation_size_, AllocationSpace.CODE_SPACE, true]);
      if (this.code_space_.isNullptr()) return false;
      if (!this.code_space_.deref().Setup(code_space_start, code_space_size)) return false;
      
      this.map_space_ = new MapSpace([Heap.kMaxMapSpaceSize, AllocationSpace.MAP_SPACE]);
      if (this.map_space_.isNullptr()) return false;
      if (!this.map_space_.deref().Setup($.nullptr, 0)) return false;

      this.lo_space_ = new LargeObjectSpace([AllocationSpace.LO_SPACE, true]);
      if (this.lo_space_.isNullptr()) return false;
      if (!this.lo_space_.deref().Setup()) return false;

      if (create_heap_objects) {
        if (!this.CreateInitialMaps()) return false;
        if (!CreateApiObjects()) return false;
    
        if (!CreateInitialObjects()) return false;
      }

      return true;
    }

    Heap.CreateInitialMaps = function() {
      let obj = this.AllocatePartialMap(InstanceType.MAP_TYPE, Map.kSize);
    };

    Heap.AllocatePartialMap = function(instance_type, instance_size) {
      let result = this.AllocateRawMap(Map.kSize);
      if (result.IsFailure()) return result;

      let map = new Map(result[sOffset]);
      map.set_map(this.meta_map());
      map.set_instance_type(instance_type);
      map.set_instance_size(instance_size);
      map.set_unused_property_fields(0);
      return result;
    };

    Heap.AllocateRawMap = function(size_in_bytes) {
      let result = this.map_space_.deref().AllocateRaw(size_in_bytes);
      if (result.IsFailure()) this.old_gen_exhausted_ = true;
      return result;
    };

    Heap.MaxCapacity = function() {
      return this.young_generation_size_ + this.old_generation_size_;
    }

    Heap.meta_map = function() {
      return this.meta_map_;
    };
    
    $[2](Heap, {
      semispace_size_: i32,
      initial_semispace_size_: i32,
      young_generation_size_: i32,
      old_generation_size_: i32,
      
      new_space_growth_limit_: i32,
      scavenge_count_: i32,
      kMaxMapSpaceSize: i32,
      
      new_space_: $ptr(NewSpace),
      old_space_: $ptr(OldSpace),
      code_space_: $ptr(OldSpace),
      map_space_: $ptr(MapSpace),
      lo_space_: $ptr(LargeObjectSpace),

      old_gen_exhausted_: i32,
      meta_map_ : $ptr(Map)
    });

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
  Handle["FunctionTemplate"] = function Handle() {
    $[0](this, ...arguments);
  };
  
  Handle["ObjectTemplate"] = function Handle() {
    $[0](this, ...arguments);
  };

  const Local = new (function Local() {});
  Local["FunctionTemplate"] = function Local() {
    
  };
  
  Local["ObjectTemplate"] = function Local() {
    
  };

  class V8 {
    static SetFlagsFromCommandLine(argc, argv, remove_flags) {
      i.FlagList.SetFlagsFromCommandLine(argc, argv, remove_flags);
    }
    //nomie perez  
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
//nomie
  class HandleScope {
    static Data = class Data {
      Initialize() {
        this.extensions = -1;
        this.next = this.limit = nullptr;
      }
      
      constructor(...args) {
        $[0](this, ...args);
      }

      static {
        $[1](this.prototype, {
          extensions: $.i32
        });
      }
    }
    //perez
    HandleScope() {
      this.previous_ = HandleScope.current_;
      this.is_closed_ = false;
      HandleScope.current_.extensions = 0;
    }
    
    constructor(...args) {
      $[0](this, ...args);
    }

    static {
      $[1](this.prototype, {
        previous_: $.type(HandleScope.Data),
        is_closed_: $.bool
      });
      $[2](this, {
        current_: $.type(this.Data)
      });
    }
  }
//perez
  class Data {
    constructor() {
      $[0](this, ...arguments);
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
}); // namespace v8

const main = (args) => {
  v8.V8.SetFlagsFromCommandLine(args.length, args, true);
  let handle_scope = new v8.HandleScope([]);
  let global = v8.ObjectTemplate.New();
  //console.log(handle_scope, global);
};
// nomie esguerra perez
main([]);