const namespace = (() => {
  let v8 = (() => {
    function v8() {
      Object.defineProperty(this, "internal", {
        value: new internal(),
        enumerable: false,
        writable: false,
        configurable: false,
      });
    }
    v8.prototype = Object.create(null);

    function internal() { }
    internal.prototype = Object.create(null);

    return new v8();
  })();
  let internal = v8.internal;
  let i = 0;

  return (scope) => {
    if (i++ == 0)
      return scope(v8)
    else if (i++ == 2)
      return scope((v8 = null) || internal)
    else
      return scope((internal = null) || Object.create(null))
  }
})();

const library = () => {
  let $String = String;

  function ObjectHasOwn(obj, prop) {
    return Object.hasOwn(obj, prop);
  }

  function ObjectDefineProperty(obj, prop, descr) {
    Object.defineProperty(obj, prop, descr);
  }

  function _class_const(obj, prop, value) {
    ObjectDefineProperty(obj, prop, {
      value: value,
      enumerable: true,
      writable: false,
      configurable: false
    });
  }

  function _class_internal(obj, prop, value) {
    ObjectDefineProperty(obj, prop, {
      value: value,
      enumerable: false,
      writable: false,
      configurable: false
    });
  }
  
  function _class_private() {
    throw new Error("Invalid invocation of a private constructor.");
  }
  
  function _class_instance(obj, offset, params, setup = () => { }) {
     if (offset == null || offset == undefined || offset == NULL) {
      if (!Object.hasOwn(obj, "::byte_offset"))
        _define_internal(obj, "::byte_offset", +_alloc(_sizeof(obj)));
      if (typeof obj["::constructor"] == "function")
        obj["::constructor"].call(obj, params);
      // setup.call(obj);
    } else if (offset instanceof Pointer) {
      _define_internal(obj, "::byte_offset", offset["::byte_offset"]);
    } else {
      if (!Object.hasOwn(obj, "::byte_offset"))
        _define_internal(obj, "::byte_offset", offset);
      if (typeof obj["::constructor"] == "function")
        obj["::constructor"].call(obj, params);
      // setup.call(obj);
    }

    Object.freeze(obj);
  }
  
  function _class_constructor(ctor, func) {
    if (typeof func != "function")
      throw new TypeError("defined constructor must be a function");
    _define_internal(ctor.prototype, "::constructor", func);
  }

  function _class_size(obj, size) {
    if (typeof size != "number")
      throw new TypeError("defined class size must be a number");
    _define_internal(obj, "::byte_length", size);
    _define_internal(obj.prototype, "::byte_length", size);
  }

  function _class_extend(child, base) {
    child.prototype = Object.create(base.prototype);
    child.prototype.constructor = child;
    for (var p in base)
      if (ObjectHasOwn(base, p))
        child[p] = base[p];
  }
  
  function _class_property(obj, name, confg) {
    let attr = null;
    if (ObjectHasOwn(confg, "as") && ObjectHasOwn(confg, "offset"))
      attr = GetDefaultGetSet(confg.as, confg.offset, confg.constructor, confg.byteLength, confg.length);
    else
      attr = confg;
    ObjectDefineProperty(obj, name, {
      get: attr.get,
      set: attr.set,
      enumerable: true,
      configurable: false,
    });
  }

  function _class_properties(obj, names) {
    for (let name in names)
      _class_property(obj, name, names[name]);
  }

  function _class_method(obj, name, func) {
    ObjectDefineProperty(obj, name, {
      value: func,
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }

  function _class_static(obj, name, value) {
    ObjectDefineProperty(obj, name, {
      value: value,
      writable: false,
      enumerable: true,
      configurable: false
    });
  }

  function _class_statics(obj, names) {
    for (let name in names) {
      _class_static(obj, name, names[name]);
    }
  }

  function _define_internal_getset(obj, prop, { get, set } = {}) {
    ObjectDefineProperty(obj, prop, {
      get,
      set,
      enumerable: false,
      configurable: false
    });
  }

  function _define_internal(obj, prop, value) {
    ObjectDefineProperty(obj, prop, {
      value: value,
      enumerable: false,
      writable: false,
      configurable: false
    });
  }

  function _define_enum_key(obj, key, value) {
    ObjectDefineProperty(obj, key, {
      value: value,
      enumerable: true,
      writable: false,
      configurable: false
    });
  }

  const buffer = new ArrayBuffer(55296);
  const int8 = new Int8Array(buffer);
  const uint8 = new Uint8Array(buffer);
  const int16 = new Int16Array(buffer);
  const uint16 = new Uint16Array(buffer);
  const int32 = new Int32Array(buffer);
  const uint32 = new Uint32Array(buffer);
  const float32 = new Float32Array(buffer);
  const float64 = new Float64Array(buffer);
  const bigint64 = new BigInt64Array(buffer);
  const biguint64 = new BigUint64Array(buffer);
window.uint8 = uint8;
window.int8 = int8;
  function roundup(num, r) {
    return (num + r - 1) & -r;
  }

  let HeapOffset = 8;

  const Memory = (function () {
    let offset = 8;
    function Memory() { }

    ObjectDefineProperty(Memory.prototype, "currentOffset", {
      get() {
        return offset;
      },
      enumerable: false,
      configurable: false
    });

    let Acquire = function (size) {
      if ((offset + size) >= buffer.byteLength)
        throw RangeError("Memory insufficient size, please add " + size + " more bytes");
      let current_offset = offset;
      offset += roundup(size, 4);
      return current_offset;
    };

    ObjectDefineProperty(Memory.prototype, "Acquire", {
      value: Acquire,
      writable: false,
      enumerable: false,
      configurable: false
    });

    Memory.prototype.valueOf = function () {
      return offset;
    }

    return new Memory();
  })();

  const AllocMemoryMap = new Map();
  const ReservedMemoryMap = new Map();
  const FreedMemoryMap = new Map();
  const CommitMemoryMap = new Map();

  const Pointer = (() => {
    function Pointer(offset, byteSize = 0) {
      if (offset < 8 && offset > 0)
        offset = 0;
      _define_internal(this, "::byte_offset", offset);
      _define_internal(this, "::byte_length", byteSize);
    }

    _class_const(Pointer.prototype, "add", function (number) {
      return new Pointer(_offsetof(this) + (number * this["::byte_length"]), this["::byte_length"]);
    });

    _class_const(Pointer.prototype, "sub", function (number) {
      return new Pointer(_offsetof(this) - (number * this["::byte_length"]), this["::byte_length"]);
    });

    _class_const(Pointer.prototype, "valueOf", function () {
      return _offsetof(this);
    });

    return Pointer;
  })();

  const NULL = new Pointer(0);

  const Array = (() => {
    function Array(length, byteSize, array) {
      _define_internal(this, "::length", length);
      _define_internal(this, "::byte_length", byteSize);

      array.forEach((item, index) => {
        console.log(index, item);
      });
    }
    return Array;
  })();

  function _pointer(offset, byteSize) {
    return new Pointer(offset, byteSize);
  }

  function _alloc(size) {
    for (const [$offset, $size] of FreedMemoryMap) {
      if ($size == size) {
        AllocMemoryMap.set($offset, size);
        FreedMemoryMap.delete($offset);
        return new Pointer($offset, 0);
      } else if ($size > size) {
        let size2 = $size - size;
        let offset2 = $offset + size2;
        FreedMemoryMap.set($offset, size2);
        AllocMemoryMap.set(offset2, size);
        return new Pointer(offset2, 0);
      }
    }
    let offset = Memory.Acquire(size);
    AllocMemoryMap.set(offset, size);
    return new Pointer(offset, 0);
  }

  function _free(ptr) {
    if (typeof ptr != "number" && !(ptr instanceof Pointer))
      throw new TypeError("unable to free non-pointer.");
    let offset = +ptr;
    let size = AllocMemoryMap.get(offset);
    if (typeof size != "number")
      throw Error("Unable to locate allocated memory at offset: " + offset + ".");
    for (let index = offset, end = offset + size; index < end; index++) {
      int8[index] = 0;
    }
    for (const [$offset, $size] of FreedMemoryMap) {
      if (offset == ($offset + $size)) {
        offset = $offset;
        size = $size + size;
      } else if ((offset + size) == $offset) {
        FreedMemoryMap.delete($offset);
        size = size + $size;
      }
    }
    FreedMemoryMap.set(offset, size);
    AllocMemoryMap.delete(offset);
    return true;
  }

  function _reserve(offset, size) {
    if (offset == NULL) {
      let offset = Memory.Acquire(size);
      ReservedMemoryMap.set(offset, size);
      return new Pointer(offset);
    }
    return NULL;
  }

  function _commit(ptr, size) {
    if (ptr instanceof Pointer) {
      let offset = +ptr;
      let $offset = 0;
      let $size = ReservedMemoryMap.get(offset);

      if (typeof $size != "number") {
        for ([$offset, $size] of ReservedMemoryMap)
          if (offset > $offset && offset < ($offset + $size)) {
            ReservedMemoryMap.set($offset, offset - $offset);

            if ((offset + size) >= ($offset + $size)) {
              CommitMemoryMap.set(offset, $size - (offset - $offset));
            } else {
              CommitMemoryMap.set(offset, size);
              ReservedMemoryMap.set(offset + size, ($offset + $size) - (offset + size));
            }
            return new Pointer(offset);
          }
      } else {
        if (size >= $size)
          size = $size;
        else
          ReservedMemoryMap.set(offset + size, $size - size);

        CommitMemoryMap.set(offset, size);
        ReservedMemoryMap.delete(offset);
        return new Pointer(offset);
      }
    }
    return NULL;
  }

  function _decommit(ptr) {
    let offset = +ptr;
    let size = CommitMemoryMap.get(offset);
    if (typeof size != "number")
      throw Error("Unable to locate committed memory at offset: " + offset + ".");
    for (let index = offset, end = offset + size; index < end; index++) {
      int8[index] = 0;
    }
    CommitMemoryMap.delete(offset);

    return true;
  }

  function _mem_copy(offset1, offset2, bytes) {
    let end = offset2 + bytes;
    for (; offset2 < end; offset1++,
      offset2++) {
      uint8[offset1] = uint8[offset2];
    }
  }

  const _data = (() => {
    function Data() { }

    const Int = (() => {
      function Int(offset, params) {
        _class_instance(this, offset, params);
      }
      
      _class_constructor(Int, function({ value = 0, signed = true }) {
        _define_internal(this, "::signed", signed);
        if (signed)
          int32[_offsetof(this) >> 2] = value;
        else
          uint32[_offsetof(this) >> 2] = value;
      });

      _class_size(Int, 4);

      _define_internal(Int.prototype, "valueOf", function () {
        if (this["::signed"])
          return int32[_offsetof(this) >> 2];
        else
          return uint32[_offsetof(this) >> 2];
      });
      
      _define_internal(Int.prototype, "increase", function(num = 1) {
        let value = this.valueOf();
        value += num;
        if (this["::signed"])
          int32[_offsetof(this) >> 2] = value;
        else
          int32[_offsetof(this) >> 2] = value;
        return this;
      });
      
      _define_internal(Int.prototype, "decrease", function(num = 1) {
        let value = this.valueOf();
        value -= num;
        if (this["::signed"])
          int32[_offsetof(this) >> 2] = value;
        else
          uint32[_offsetof(this) >> 2] = value;
        return this;
      });
      return Int;
    })();
    
    const String = (() => {
      function String(offset, params) {
        _class_instance(this, offset, params);
      }
      
      _class_constructor(String, function({ value = "" }) {
        let ptr = _alloc(value.length + 1).valueOf();
        uint32[_offsetof(this) >> 2] = ptr;
        for (let index = 0, end = value.length; index < end; index++) {
          uint8[ptr + index] = value.charCodeAt(index);
        }
        uint8[ptr + value.length] = 0;
      });

      _class_size(String, 4);

      _define_internal(String.prototype, "valueOf", function () {
        let str = [], ptr = uint32[_offsetof(this) >> 2];
        let c = -1;
        while ((c = uint8[ptr++]) != 0) {
          str.push($String.fromCharCode(c));
        }
        return str.join("");
      });

      return String;
    })();

    const Short = (() => {
      function Short(offset, params) {
        _class_instance(this, offset, params);
      }
      
      _class_constructor(Short, function({ value = 0, signed = true }) {
        _define_internal(this, "::signed", signed);
        if (signed)
          int16[_offsetof(this) >> 1] = value;
        else
          uint16[_offsetof(this) >> 1] = value;
      });

      _class_size(Short, 2);

      _define_internal(Short.prototype, "valueOf", function () {
        if (this["::signed"])
          return int16[_offsetof(this) >> 1];
        else
          return uint16[_offsetof(this) >> 1];
      });

      return Short;
    })();

    const Double = (() => {
      function Double(offset, params) {
        _class_instance(this, offset, params);
      }
      
      _class_constructor(Double, function({ value = 0 }) {
        float64[_offsetof(this) >> 3] = value;
      });

      _class_size(Double, 8);

      _define_internal(Double.prototype, "valueOf", function () {
        return float64[_offsetof(this) >> 3];
      });
      return Double;
    })();

    const Long = (() => {
      function Long(offset, params) {
        _class_instance(this, offset, params);
      }
      
      _class_constructor(Long, function({ value }) {
        float64[_offsetof(this) >> 3] = value;
      });

      _class_size(Long, 8);

      _define_internal(Long.prototype, "valueOf", function () {
        return float64[_offsetof(this) >> 3];
      });

      return Long;
    })();

    const Char = (() => {
      function Char(offset, params) {
        _class_instance(this, offset, params);
      }
      
      _class_constructor(Char, function({ value = '', signed = false }) {
        if (signed)
          int8[_offsetof(this)] = value.charCodeAt(0);
        else
          uint8[_offsetof(this)] = value.charCodeAt(0);
      });

      _class_size(Char, 1);

      _define_internal(Char.prototype, "valueOf", function () {
        if (this["::signed"])
          return String.fromCharCode(int8[_offsetof(this)]);
        else
          return String.fromCharCode(uint8[_offsetof(this)]);
      });
      return Char;
    })();

    _define_internal(Data.prototype, "int", (value) => {
      if (value instanceof Pointer)
        return new Int(value, {});
      if (typeof value != "number")
        throw new TypeError((typeof value) + " is not compatible with type int.");
      return new Int(null, {
        value
      });
    });

    _define_internal(Data.prototype, "string", (value) => {
      if (value instanceof Pointer)
        return new String(value, {});
      if (typeof value != "string")
        throw new TypeError((typeof value) + " is not compatible with type string.");
      return new String(null, {
        value
      });
    });

    _define_internal(Data.prototype, "short", (value) => {
      if (value instanceof Pointer)
        return new Short(value, {});
      if (typeof value != "number")
        throw new TypeError((typeof value) + " is not compatible with type short.");
      return new Short(null, {
        value
      });
    });

    _define_internal(Data.prototype, "double", (value) => {
      if (value instanceof Pointer)
        return new Double(value, {});
      if (typeof value != "number")
        throw new TypeError((typeof value) + " is not compatible with type double.");
      return new Double(null, {
        value
      });
    });

    _define_internal(Data.prototype, "char", (value) => {
      if (value instanceof Pointer)
        return new Char(value, {});
      if (typeof value != "string")
        throw new TypeError((typeof value) + " is not compatible with type char.");
      return new Char(null, {
        value
      });
    });

    _define_internal(Data.prototype, "long", (value) => {
      if (value instanceof Pointer)
        return new Long(value, {});
      if (typeof value != "number")
        throw new TypeError((typeof value) + " is not compatible with type long.");
      return new Char(null, {
        value
      });
    });

    return new Data();
  })();

  let previous_key = -1;
  function _enum_key(obj, key, value) {
    if (value == undefined) {
      //obj[obj[key] = ++previous_key] = key;
      _define_enum_key(obj, key, ++previous_key);
    } else {
      //obj[obj[key] = value] = key;
      _define_enum_key(obj, key, value);
      previous_key = value;
    }
  }

  function _enum_end() {
    previous_key = -1;
  }

  function GetDefaultGetSet(type, offset, constructor, byteLength, length) {
    switch (type) {
      case "int8":
        return {
          get() {
            return int8[_offsetof(this) + offset];
          },
          set(data) {
            return int8[_offsetof(this) + offset] = data;
          }
        };
      case "short":
      case "int16":
        return {
          get() {
            return int16[((_offsetof(this) + offset) >> 1)];
          },
          set(data) {
            return int16[((_offsetof(this) + offset) >> 1)] = data;
          }
        };
      case "int32":
      case "int":
        return {
          get() {
            return int32[(_offsetof(this) + offset) >> 2];
          },
          set(data) {
            return int32[(_offsetof(this) + offset) >> 2] = data;
          }
        };
      case "uint8":
        return {
          get() {
            return uint8[_offsetof(this) + offset];
          },
          set(data) {
            return uint8[_offsetof(this) + offset] = data;
          }
        };
      case "uint16":
        return {
          get() {
            return uint16[(_offsetof(this) + offset) >> 1];
          },
          set(data) {
            return uint16[(_offsetof(this) + offset) >> 1] = data;
          }
        };
      case "uint32":
        return {
          get() { return uint32[(_offsetof(this) + offset) >> 2]; },
          set(data) { return uint32[(_offsetof(this) + offset) >> 2] = data; }
        };
      case "float":
      case "float32":
        return {
          get() { return float32[(_offsetof(this) + offset) >> 2]; },
          set(data) { return float32[(_offsetof(this) + offset) >> 2] = data; }
        };
      case "double":
      case "float64":
        return {
          get() { return float64[(_offsetof(this) + offset) >> 3]; },
          set(data) { return float64[(_offsetof(this) + offset) >> 3] = data; }
        };
      case "long":
      case "bigint64":
        return {
          get() { return bigint64[(_offsetof(this) + offset) >> 3]; },
          set(data) { return bigint64[(_offsetof(this) + offset) >> 3] = data; }
        };
      case "biguint64":
        return {
          get() { return biguint64[(_offsetof(this) + offset) >> 3]; },
          set(data) { return biguint64[(_offsetof(this) + offset) >> 3] = data; }
        };
      case "char":
        return {
          get() { return String.fromCharCode(uint8[_offsetof(this) + offset]); },
          set(data) { return uint8[_offsetof(this) + offset] = (typeof data == "string" ? data.charCodeAt(0) : data); }
        };
      case "bool":
        return {
          get() {
            let bool = uint8[_offsetof(this) + offset];
            return bool === 1 ? true : false;
          },
          set(bool) {
            if (typeof bool != "boolean")
              throw "unable to pass typeof " + (typeof bool) + " to a boolean type property";
            return uint8[_offsetof(this) + offset] = (bool ? 1 : 0);
          }
        };
      case "char*":
      case "string":
        return {
          get() {
            let ptr = uint32[(_offsetof(this) + offset) >> 2];
            let string = "";
            let c = '';
            while ((c = uint8[ptr]) != 0) {
              if (typeof c != "number")
                throw new TypeError("Invalid character");
              string += String.fromCharCode(c);
              ptr++;
            }
            return string;
          },
          set(string) {
            if (typeof string != "string")
              throw new TypeError("unable to pass " + (typeof string) + " to a string type property.");
            let ptr = +_alloc(string.length + 1);
            uint32[(_offsetof(this) + offset) >> 2] = ptr;
            for (let index = 0, end = string.length; index < end; index++) {
              uint8[ptr + index] = string.charCodeAt(index);
            }
            uint8[ptr + string.length] = 0;
            // null terminator
            return string;
          }
        };
      case "*":
        return {
          get() {
            if (typeof constructor != "function")
              constructor = function (ptr) { return ptr; };
            let ptr = uint32[(_offsetof(this) + offset) >> 2];
            if (ptr == 0) return NULL;
            return constructor(new Pointer(ptr));
          },
          set(obj) {
            if (!obj || typeof _offsetof(obj) != "number")
              throw TypeError("Invalid object, not implemeting ::byte_offset property.");
            uint32[(_offsetof(this) + offset) >> 2] = _offsetof(obj);
            return obj;
          }
        };
      case "[]":
        return {
          get() {
            return function (index, data) {
              if (index >= length)
                throw new RangeError("Array index out of bounds.");
              if (data == undefined) {
                return constructor("get", new Pointer(_offsetof(this) + offset + (byteSize * index)));
              } else {
                if (typeof data == "number") {
                  constructor("set", (_offsetof(this) + offset + (byteSize * index)), data);
                } else {
                  _mem_copy(_offsetof(this) + offset + (byteSize * index), _offsetof(data), length);
                }
                return data;
              }
            };
          },
          set(arr) {
            _mem_copy(_offsetof(this), _offsetof(arr), length);
            return arr;
          }
        };
      case "&":
        return {
          get() {
            return constructor(new Pointer(_offsetof(this) + offset));
          },
          set(obj) {
            if (obj == undefined || obj == null)
              return null;
            _mem_copy(_offsetof(this) + offset, _offsetof(obj), byteLength);
            return constructor(new Pointer(_offsetof(this) + offset));
          }
        };
    }
    throw "UNREACHABLE";
  }
  
  function _sizeof(obj) {
    if (obj == null || obj == undefined)
      throw new TypeError("Invalid object");
    return obj["::byte_length"];
  }

  function _addressof(obj) {
    if (obj == null || obj == undefined)
      throw new TypeError("Invalid object");
    return new Pointer(_offsetof(obj), _sizeof(obj));
  }

  function _offsetof(obj) {
    if (obj == null || obj == undefined)
      throw new TypeError("Invalid object");
    return obj["::byte_offset"];
  }

  const Address = (() => {
    function Address(offset) {
      Pointer.call(this, offset, 1);
    }
    _class_extend(Address, Pointer);
    return Address;
  })();

  return {
    alloc: _alloc,
    free: _free,
    reserve: _reserve,
    commit: _commit,
    decommit: _decommit,
    memory_copy: _mem_copy,

    int8,
    int16,
    int32,
    uint8,
    uint16,
    uint32,
    float32,
    float64,
    bigint64,
    biguint64,

    pointer: _pointer,

    class_instance: _class_instance,
    class_constructor: _class_constructor,
    class_size: _class_size,
    class_extend: _class_extend,
    class_const: _class_const,
    class_internal: _class_internal,
    class_private: _class_private,
    class_property: _class_property,
    class_properties: _class_properties,
    class_method :_class_method,
    class_static: _class_static,
    class_statics: _class_statics,
    data: _data,
    enum_key: _enum_key,
    enum_end: _enum_end,

    sizeof: _sizeof,
    addressof: _addressof,
    offsetof: _offsetof,

    NULL,

    /*
    Pointer,
    Class,
    Address*/
  };
};

// the v8 javascript engine namespace
const v8 = namespace((v8) => {
  const { alloc, free, reserve, commit, decommit, memory_copy, int8, int16, int32, uint8, uint16, uint32, float32, float64, bigint64, biguint64, data, enum_key, enum_end, class_instance, class_constructor, class_size, class_extend, class_const, class_internal, class_private, class_property, class_properties, class_method, class_static, class_statics, sizeof, addressof, offsetof, pointer, NULL, } = library();

  const FLAG_stack_trace_on_abort = true;

  let fatal_error_handler_nesting_depth = 0;

  const V8_Fatal = function (file, line, format, ...args) {
    fatal_error_handler_nesting_depth++;

    if (fatal_error_handler_nesting_depth < 2) {
      console.error("\n\n#\n# Fatal error in " + file + ", line " + line + "\n# "
        + format + "\n#\n\n");
    }

    if (fatal_error_handler_nesting_depth < 3) {
      if (FLAG_stack_trace_on_abort) {
        internal.Top.printStack();
      }
    }
  };
  
  namespace((internal) => {
    const KB = 1024;
    const MB = KB * KB;
    const kMaxInt = 0x7FFFFFFF;

    const kIntSize = 4;
    // int size in 32 bit machine
    const kPointerSize = 4;
    // pointer size in 32 bit machine

    const kHeapObjectTag = 1;

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

    const Type2String = (type) => {
      switch (type) {
        case Flag.Type.BOOL:
          return "bool";
        case Flag.Type.INT:
          return "int";
        case Flag.Type.FLOAT:
          return "float";
        case Flag.Type.STRING:
          return "string";
      }
      return null;
    }

    const Object = (() => {
      function Object(offset) {
        class_instance(this, offset);
      }
      
      class_constructor(Object, function() {

      });
      
      class_static(Object, "ksize", 0);
      return Object;
    })();
    internal.Object = Object;

    const HeapObject = (() => {
      function HeapObject(offset) {
        class_instance(this, offset);
      }
      
      class_constructor(HeapObject, function() {
        Object.call(this);
      });

      class_extend(HeapObject, Object);

      class_static(HeapObject, "kMapOffset", Object.kSize);
      class_static(HeapObject, "kSize", HeapObject.kMapOffset + kPointerSize);

      return HeapObject;
    })();
    internal.HeapObject = HeapObject;

    const Map = (() => {
      function Map(offset) {
        class_instance(this, offset);
      }
      
      class_constructor(Map, function() {
        HeapObject.call(this);
      });

      class_static(Map, "kInstanceAttributesOffset", HeapObject.kSize);
      class_static(Map, "kPrototypeOffset", Map.kInstanceAttributesOffset + kIntSize);
      class_static(Map, "kConstructorOffset", Map.kPrototypeOffset + kPointerSize);
      class_static(Map, "kInstanceDescriptorsOffset", Map.kConstructorOffset + kPointerSize);
      class_static(Map, "kCodeCacheOffset", Map.kInstanceDescriptorsOffset + kPointerSize);
      class_static(Map, "kSize", Map.kCodeCacheOffset + kIntSize);
      return Map;
    })();

    const Array = (() => {
      function Array() { }

      class_extend(Array, HeapObject);

      Array.kLengthOffset = HeapObject.kSize;
      Array.kHeaderSize = Array.kLengthOffset + kIntSize;
      return Array;
    })(HeapObject);
    internal.Array = Array;

    const AllocationSpace = (() => {
      var en = new (function AllocationSpace() { });
      enum_key(en, "NEW_SPACE");
      enum_key(en, "OLD_SPACE");
      enum_key(en, "CODE_SPACE");
      enum_key(en, "MAP_SPACE");
      enum_key(en, "LO_SPACE");

      enum_key(en, "FIRST_SPACE", en.NEW_SPACE);
      enum_key(en, "LAST_SPACE", en.LO_SPACE);
      enum_end();
      return en;
    })();

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

    const StringRepresentationTag = (() => {
      let en = new (function StringRepresentationTag() { }
      );
      enum_key(en, "kSeqStringTag", 0x0);
      enum_key(en, "kConsStringTag", 0x1);
      enum_key(en, "kSlicedStringTag", 0x2);
      enum_key(en, "kExternalStringTag", 0x3);
      enum_end();
      return en;
    })();

    const InstanceType = (() => {
      let en = new (function InstanceType() { });

      enum_key(en, "SHORT_SYMBOL_TYPE", kShortStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag);
      enum_key(en, "MEDIUM_SYMBOL_TYPE", kMediumStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag);
      enum_key(en, "LONG_SYMBOL_TYPE", kLongStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag);
      enum_key(en, "SHORT_ASCII_SYMBOL_TYPE", kShortStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag);
      enum_key(en, "MEDIUM_ASCII_SYMBOL_TYPE", kMediumStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag);
      enum_key(en, "LONG_ASCII_SYMBOL_TYPE", kLongStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag);
      enum_key(en, "SHORT_CONS_SYMBOL_TYPE", kShortStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag);
      enum_key(en, "MEDIUM_CONS_SYMBOL_TYPE", kMediumStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag);
      enum_key(en, "LONG_CONS_SYMBOL_TYPE", kLongStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag);
      enum_key(en, "SHORT_CONS_ASCII_SYMBOL_TYPE", kShortStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag);
      enum_key(en, "MEDIUM_CONS_ASCII_SYMBOL_TYPE", kMediumStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag);
      enum_key(en, "LONG_CONS_ASCII_SYMBOL_TYPE", kLongStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag);
      enum_key(en, "SHORT_SLICED_SYMBOL_TYPE", kShortStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag);
      enum_key(en, "MEDIUM_SLICED_SYMBOL_TYPE", kMediumStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag);
      enum_key(en, "LONG_SLICED_SYMBOL_TYPE", kLongStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag);
      enum_key(en, "SHORT_SLICED_ASCII_SYMBOL_TYPE", kShortStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag);
      enum_key(en, "MEDIUM_SLICED_ASCII_SYMBOL_TYPE", kMediumStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag);
      enum_key(en, "LONG_SLICED_ASCII_SYMBOL_TYPE", kLongStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag);
      enum_key(en, "SHORT_EXTERNAL_SYMBOL_TYPE", kShortStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag);
      enum_key(en, "MEDIUM_EXTERNAL_SYMBOL_TYPE", kMediumStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag);
      enum_key(en, "LONG_EXTERNAL_SYMBOL_TYPE", kLongStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag);
      enum_key(en, "SHORT_EXTERNAL_ASCII_SYMBOL_TYPE", kShortStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag);
      enum_key(en, "MEDIUM_EXTERNAL_ASCII_SYMBOL_TYPE", kMediumStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag);
      enum_key(en, "LONG_EXTERNAL_ASCII_SYMBOL_TYPE", kLongStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag);
      enum_key(en, "SHORT_STRING_TYPE", kShortStringTag | StringRepresentationTag.kSeqStringTag);
      enum_key(en, "MEDIUM_STRING_TYPE", kMediumStringTag | StringRepresentationTag.kSeqStringTag);
      enum_key(en, "LONG_STRING_TYPE", kLongStringTag | StringRepresentationTag.kSeqStringTag);
      enum_key(en, "SHORT_ASCII_STRING_TYPE", kShortStringTag | kAsciiStringTag | StringRepresentationTag.kSeqStringTag);
      enum_key(en, "MEDIUM_ASCII_STRING_TYPE", kMediumStringTag | kAsciiStringTag | StringRepresentationTag.kSeqStringTag);
      enum_key(en, "LONG_ASCII_STRING_TYPE", kLongStringTag | kAsciiStringTag | StringRepresentationTag.kSeqStringTag);
      enum_key(en, "SHORT_CONS_STRING_TYPE", kShortStringTag | StringRepresentationTag.kConsStringTag);
      enum_key(en, "MEDIUM_CONS_STRING_TYPE", kMediumStringTag | StringRepresentationTag.kConsStringTag);
      enum_key(en, "LONG_CONS_STRING_TYPE", kLongStringTag | StringRepresentationTag.kConsStringTag);
      enum_key(en, "SHORT_CONS_ASCII_STRING_TYPE", kShortStringTag | kAsciiStringTag | StringRepresentationTag.kConsStringTag);
      enum_key(en, "MEDIUM_CONS_ASCII_STRING_TYPE", kMediumStringTag | kAsciiStringTag | StringRepresentationTag.kConsStringTag);
      enum_key(en, "LONG_CONS_ASCII_STRING_TYPE", kLongStringTag | kAsciiStringTag | StringRepresentationTag.kConsStringTag);
      enum_key(en, "SHORT_SLICED_STRING_TYPE", kShortStringTag | StringRepresentationTag.kSlicedStringTag);
      enum_key(en, "MEDIUM_SLICED_STRING_TYPE", kMediumStringTag | StringRepresentationTag.kSlicedStringTag);
      enum_key(en, "LONG_SLICED_STRING_TYPE", kLongStringTag | StringRepresentationTag.kSlicedStringTag);
      enum_key(en, "SHORT_SLICED_ASCII_STRING_TYPE", kShortStringTag | kAsciiStringTag | StringRepresentationTag.kSlicedStringTag);
      enum_key(en, "MEDIUM_SLICED_ASCII_STRING_TYPE", kMediumStringTag | kAsciiStringTag | StringRepresentationTag.kSlicedStringTag);
      enum_key(en, "LONG_SLICED_ASCII_STRING_TYPE", kLongStringTag | kAsciiStringTag | StringRepresentationTag.kSlicedStringTag);
      enum_key(en, "SHORT_EXTERNAL_STRING_TYPE", kShortStringTag | StringRepresentationTag.kExternalStringTag);
      enum_key(en, "MEDIUM_EXTERNAL_STRING_TYPE", kMediumStringTag | StringRepresentationTag.kExternalStringTag);
      enum_key(en, "LONG_EXTERNAL_STRING_TYPE", kLongStringTag | StringRepresentationTag.kExternalStringTag);
      enum_key(en, "SHORT_EXTERNAL_ASCII_STRING_TYPE", kShortStringTag | kAsciiStringTag | StringRepresentationTag.kExternalStringTag);
      enum_key(en, "MEDIUM_EXTERNAL_ASCII_STRING_TYPE", kMediumStringTag | kAsciiStringTag | StringRepresentationTag.kExternalStringTag);
      enum_key(en, "LONG_EXTERNAL_ASCII_STRING_TYPE", kLongStringTag | kAsciiStringTag | StringRepresentationTag.kExternalStringTag);
      enum_key(en, "LONG_PRIVATE_EXTERNAL_ASCII_STRING_TYPE", en.LONG_EXTERNAL_ASCII_STRING_TYPE);

      enum_key(en, "MAP_TYPE", kNotStringTag);
      enum_key(en, "HEAP_NUMBER_TYPE", en.MAP_TYPE + 1);
      enum_key(en, "FIXED_ARRAY_TYPE", en.HEAP_NUMBER_TYPE + 1);
      enum_key(en, "CODE_TYPE", en.FIXED_ARRAY_TYPE + 1);
      enum_key(en, "ODDBALL_TYPE", en.CODE_TYPE + 1);
      enum_key(en, "PROXY_TYPE", en.ODDBALL_TYPE + 1);
      enum_key(en, "BYTE_ARRAY_TYPE", en.PROXY_TYPE + 1);
      enum_key(en, "FILLER_TYPE", en.BYTE_ARRAY_TYPE + 1);
      enum_key(en, "SMI_TYPE", en.FILLER_TYPE + 1);

      enum_key(en, "ACCESSOR_INFO_TYPE", en.SMI_TYPE + 1);
      enum_key(en, "ACCESS_CHECK_INFO_TYPE", en.ACCESSOR_INFO_TYPE + 1);
      enum_key(en, "INTERCEPTOR_INFO_TYPE", en.ACCESS_CHECK_INFO_TYPE + 1);
      enum_key(en, "SHARED_FUNCTION_INFO_TYPE", en.INTERCEPTOR_INFO_TYPE + 1);
      enum_key(en, "CALL_HANDLER_INFO_TYPE", en.SHARED_FUNCTION_INFO_TYPE + 1);
      enum_key(en, "FUNCTION_TEMPLATE_INFO_TYPE", en.CALL_HANDLER_INFO_TYPE + 1);
      enum_key(en, "OBJECT_TEMPLATE_INFO_TYPE", en.FUNCTION_TEMPLATE_INFO_TYPE + 1);
      enum_key(en, "SIGNATURE_INFO_TYPE", en.OBJECT_TEMPLATE_INFO_TYPE + 1);
      enum_key(en, "TYPE_SWITCH_INFO_TYPE", en.SIGNATURE_INFO_TYPE + 1);
      enum_key(en, "DEBUG_INFO_TYPE", en.TYPE_SWITCH_INFO_TYPE + 1);
      enum_key(en, "BREAK_POINT_INFO_TYPE", en.DEBUG_INFO_TYPE + 1);
      enum_key(en, "SCRIPT_TYPE", en.BREAK_POINT_INFO_TYPE + 1);

      enum_key(en, "JS_OBJECT_TYPE", en.SCRIPT_TYPE + 1);
      enum_key(en, "JS_GLOBAL_OBJECT_TYPE", en.JS_OBJECT_TYPE + 1);
      enum_key(en, "JS_BUILTINS_OBJECT_TYPE", en.JS_GLOBAL_OBJECT_TYPE + 1);
      enum_key(en, "JS_VALUE_TYPE", en.JS_BUILTINS_OBJECT_TYPE + 1);
      enum_key(en, "JS_ARRAY_TYPE", en.JS_VALUE_TYPE + 1);
      enum_key(en, "JS_FUNCTION_TYPE", en.JS_ARRAY_TYPE + 1);

      enum_key(en, "FIRST_NONSTRING_TYPE", en.MAP_TYPE);
      enum_key(en, "FIRST_TYPE", 0x0);
      enum_key(en, "LAST_TYPE", en.JS_FUNCTION_TYPE);
      enum_key(en, "FIRST_JS_OBJECT_TYPE", en.JS_OBJECT_TYPE);
      enum_key(en, "LAST_JS_OBJECT_TYPE", en.JS_ARRAY_TYPE);
      enum_end();
    })();

    const Top = (() => {
      function Top() { }

      Top.printStack = function () {
        console.warn("Not yet implemented Top.printStack.cls");
      };

      return Top;
    })();
    internal.Top = Top;

    const FlagValue = (() => {
      function FlagValue(offset) {
        class_instance(this, offset);
      }
      
      class_size(FlagValue, 8);

      class_properties(FlagValue.prototype, {
        b: { offset: 0, as: "bool" },
        i: { offset: 0, as: "int" },
        f: { offset: 0, as: "float" },
        s: { offset: 0, as: "string" }
      });

      class_statics(FlagValue, {
        New_BOOL(b) {
          let v = new FlagValue(null);
          v.b = b;
          return v;
        },
        New_INT(i) {
          let v = new FlagValue(null);
          v.i = i;
          return v;
        },
        New_FLOAT(f) {
          let v = new FlagValue(null);
          v.f = f;
          return v;
        },
        New_STRING(s) {
          let v = new FlagValue(null);
          v.s = s;
          return v;
        }
      });
      return FlagValue;
    })();
    internal.FlagValue = FlagValue;

    const FlagList = (() => {
      function FlagList() { }

      FlagList.list_ = NULL;

      FlagList.lookup = function (name) {
        let f = FlagList.list_;

        while (f != NULL && f.name() != name)
          f = f.next();
        return f;
      };

      FlagList.splitArgument = function (arg, is_bool) {
        var name = null;
        var value = null;
        var is_bool = false;
        var index = 0;

        if (arg.charAt(index) == "-") {
          index++;
          if (arg.charAt(index) == "-")
            index++;
          if (arg.substr(index, 2) == "no") {
            index += 2;
            is_bool = true;
          }

          var name_start = index;

          while (arg.charAt(index) != "=" && index < arg.length)
            index++;
          if (arg.charAt(index) == "=") {
            name = arg.substring(name_start, index);
            value = arg.substr(index + 1);
          }
        }

        return [value, name, is_bool];
      }

      FlagList.setFlagsFromCommandLine = function (argv, remove_flags) {
        for (var i = 0; i < argv.length;) {
          let j = i;
          let arg = argv[i++];
          const [name, value, is_bool] = FlagList.splitArgument(arg, remove_flags);
          // console.log(name, value, is_bool);
          if (name != null) {
            let flag = FlagList.lookup(name);

            if (flag == null) {
              if (remove_flags) {
                continue;
              } else {
                console.error(`Error: unrecognized flag ${arg}`);
                return j;
              }
            }

            if (flag.type() != Flag.Type.BOOL && value == null) {
              if (i < argv.length) {
                value = argv[i++];
              } else {
                console.error(`Error: missing value for flag ${arg} of type ${type2String(flag.type())}`);
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

            if ((flag.type() == Flag.Type.BOOL && value != null) || (flag.type() != Flag.Type.BOOL && is_bool)) {
              console.error(`Error: illegal value for flag ${arg} of type ${type2String(flag.type())}`);
              return j;
            }

            if (remove_flags)
              while (j < i)
                argv[j++] = null;
          }
        }

        let limit = argv.length;
        if (remove_flags) {
          let j = 0;

          for (let i = 0; i < limit; i++) {
            if (argv[i] != null)
              argv[j++] = argv[i];
          }
          limit = j;
        }
        return 0;
      };

      FlagList.register = function (flag) {
        ASSERT(flag != null && flag.name().length > 0, "flag != null && flag.name().length > 0");
        if (FlagList.lookup(flag.name()) != NULL)
          V8_Fatal(flag.file(), 0, "flag " + flag.name() + " declared twice");
        flag.next_ = FlagList.list_;
        FlagList.list_ = flag;
      };
      return FlagList;
    })();
    internal.FlagList = FlagList;

    const Flag = (() => {
      function Flag(offset, { file, name, comment, type, variable, default_ }) {
        class_instance(this, offset, () => {
          this.file_ = file;
          this.name_ = name.replaceAll("_", "-");
          this.comment_ = comment;
          this.type_ = type;
          this.variable_ = new FlagValue(offsetof(variable));
          this.default_ = default_;

          FlagList.register(this);
        });
      }

      class_size(Flag, 32);

      class_properties(Flag.prototype, {
        file_: {
          offset: 0,
          as: "string"
        },
        name_: {
          offset: 4,
          as: "string"
        },
        comment_: {
          offset: 8,
          as: "string"
        },
        type_: {
          offset: 12,
          as: "int"
        },
        variable_: {
          offset: 16,
          as: "*",
          constructor(ptr) {
            return new FlagValue(ptr);
          }
        },
        next_: {
          offset: 28,
          as: "*",
          constructor(ptr) {
            return new Flag(ptr, {});
          }
        }
      });

      class_property(Flag.prototype, "default_", {
        get() {
          return new FlagValue(offsetof(this) + 20);
        },
        set(obj) {
          memory_copy(offsetof(this) + 20, offsetof(obj), 8);
        }
      });

      Flag.prototype.file = function() {
        return this.file_;
      };
      
      Flag.prototype.name = function () {
        return this.name_;
      };

      Flag.prototype.comment = function () {
        return this.comment_;
      };

      Flag.prototype.type = function () {
        return this.type_;
      };

      Flag.prototype.next = function () {
        return this.next_;
      };

      Flag.prototype.bool_variable = function (b) {
        if (typeof b == "undefined")
          return this.variable_.b;
        else
          this.variable_.b = b;
      };

      Flag.prototype.int_variable = function (i) {
        if (typeof i == "undefined")
          return this.variable_.i;
        else
          this.variable_.i = i;
      };

      Flag.prototype.float_variable = function (f) {
        if (typeof f == "undefined")
          return this.variable_.f;
        else
          this.variable_.f = f;
      };

      Flag.prototype.string_variable = function (s) {
        if (typeof s == "undefined")
          return this.variable_.s;
        else
          this.variable_.s = s;
      };

      const Type = (() => {
        var en = new (function Type() { });
        enum_key(en, "BOOL");
        enum_key(en, "INT");
        enum_key(en, "FLOAT");
        enum_key(en, "STRING");
        enum_end();
        return en;
      })();
      Flag.Type = Type;

      return Flag;
    }
    )();
    internal.Flag = Flag;
    
    const Malloced = (function() {
      function Malloced() { }
      class_static(Malloced, "New", function(size) {
        return alloc(size);
      });
      
      class_static(Malloced, "Delete", function(ptr) {
        free(ptr);
      });
      return Malloced;
    })();
    
    const FreeStoreAllocationPolicy = (function() {
      function FreeStoreAllocationPolicy() { }
      class_method(FreeStoreAllocationPolicy.prototype, "New", function(size) {
        return Malloced.New(size);
      });
      
      class_method(FreeStoreAllocationPolicy.prototype, "Delete", function(p) {
        Malloced.Delete(p);
      });
      return FreeStoreAllocationPolicy;
    })();
    internal.FreeStoreAllocationPolicy = FreeStoreAllocationPolicy;
    
    const List = (() => {
      function List(offset, policy, itemSize, constructor, params) {
        class_internal(this, "::item_size", itemSize);
        class_internal(this, "::item_constructor", constructor);
        class_internal(this, "::allocation_policy", policy);
        class_instance(this, offset, params);
      }
      
      class_constructor(List, function({ capacity }) {
        this.Initialize(capacity);
      });
      
      class_size(List, 12);
      
      class_properties(List.prototype, {
        data_: {
          offset: 0, as: "*",
          constructor(ptr) {
            return ptr;
          }
        },
        capacity_: {
          offset: 4, as: "int",
        },
        length_: {
          offset: 8, as: "int"
        }
      });
      
      class_method(List.prototype, "Add", function(element) {
        if (typeof offsetof(element || {}) != "number")
          throw new TypeError("Unable to copy non-memory object");
            
        if (this.length_ >= this.capacity_) {
          let new_capacity = 1 + this.capacity_ + (this.capacity_ >> 1);
          let new_data = this.NewData(new_capacity);
          memory_copy(new_data, this.data_, this.capacity_ * this["::item_size"]);
          this.DeleteData(this.data_);
          this.data_ = new_data;
          this.capacity_ = new_capacity;
        }
        
        memory_copy((this.data_ + (this.length_ * this["::item_size"])), offsetof(element), this["::item_size"]);
        this.length_++;
      });
      
      class_method(List.prototype, "Initialize", function(capacity) {
        ASSERT(capacity >= 0);
        this.data_ = (capacity > 0) ? this.NewData(capacity) : NULL;
        this.capacity_ = capacity;
        this.length_ = 0;
      });
      
      class_method(List.prototype, "NewData", function(n) {
        let ptr = this["::allocation_policy"].New(n * this["::item_size"]);
        return ptr;
      });
      
      class_method(List.prototype, "DeleteData", function(data) {
        this["::allocation_policy"].Delete(data);
      });
      
      return List;
    })();
    internal.List = List;
    
    const Logger = (() => {
      function Logger() { }
      class_method(Logger.prototype, "GetLogger", function() {
        throw new Error("unimplemented 'Logger::GetLogger'");
      });
      class_static(Logger, "Setup", function() {
        return false;
      });
      return Logger;
    })();
    internal.Logger = Logger;
    
    const V8 = (() => {
      function V8() {
        class_private();
      }
      
      class_static(V8, "has_been_setup_", false);
      class_static(V8, "has_been_disposed_", false);
      
      class_static(V8, "HasBeenSetup", function() {
        return V8.has_been_setup_;
      });
      
      class_static(V8, "HasBeenDisposed", function() {
        return V8.has_been_disposed_;
      });
         
      class_static(V8, "Initialize", function(des) {
        let create_heap_objects = des == null;
        if (V8.HasBeenDisposed()) return false;
        if (V8.HasBeenSetup()) return true;
        
        V8.has_been_setup_ = true;
        Logger.Setup();
        
        if (des) des.getLog();
            
        CPU.Setup();
        OS.Setup();
        
        if (!Heap.Setup(create_heap_objects)) {
          this.has_been_setup_ = false;
          return false;
        }
        
        // TODO: you stopped here
        return true;
      });
      return V8;
    })();
    internal.V8 = V8;
    
    const Snapshot = (() => {
      function Snapshot() { }
         
      class_static(Snapshot, "data_", "");
      class_static(Snapshot, "size_", 0);
      
      class_static(Snapshot, "Deserialize", function(content, len) {
        let des = new Deserializer(content, len);
        des.getFlags();
        return V8.Initialize(des);
      });
         
      class_static(Snapshot, "Initialize", function(snapshot_file = null) {
        if (snapshot_file) {
          throw new Error("unimplemented initializing with snapshot");
        } else if (Snapshot.size_ > 0) {
          return Snapshot.Deserialize(Snapshot.data_, Snapshot.size_);
        }
        return false;
      });
      return Snapshot;
    })();
    internal.Snapshot = Snapshot;
    
    const ObjectVisitor = (() => {
      function ObjectVisitor() { }
      return ObjectVisitor;
    })();
    internal.ObjectVisitor = ObjectVisitor;
    
    const Serializer = (() => {
      function Serializer() {
        ObjectVisitor.call(this);
      }
         
      class_extend(Serializer, ObjectVisitor);

      Serializer.serialization_enabled_ = false;
         
      Serializer.disable = function() {
        this.serialization_enabled_ = false;
      };
      return Serializer;
    })(ObjectVisitor);
    internal.Serializer = Serializer;
    
    const SnapshotReader = (() => {
      function SnapshotReader(str, len) {
        this.str_ = str;
        this.end_ = len;
        this.index_ = 0;
      }
      
      SnapshotReader.prototype.expectC = function(expected) {
        let c = this.getC();
        ASSERT(c == expected, "c == expected");
      };

      SnapshotReader.prototype.getC = function() {
        if (this.index_ >= this.end_) return String.fromCharCode(0);
          return this.str_.charAt(this.index_++);
      };
      return SnapshotReader;
    })();
    internal.SnapshotReader = SnapshotReader;
    
    const Deserializer = (() => {
      function Deserializer(str, len) {
        ObjectVisitor.call(this);
        this.reader_ = new SnapshotReader(str, len);
        
        this.root_ = true;
        this.roots_ = 0;
        this.objects_ = 0;
        this.reference_decoder_ = null;
      }
         
      class_extend(Deserializer, ObjectVisitor);
         
      Deserializer.prototype.getFlags = function() {
        this.reader_.expectC("F");
      };
      return Deserializer;
    })();
    internal.Deserializer = Deserializer;
    
    const CPU = (() => {
      function CPU() { }
      class_static(CPU, "Setup", function() {
        // nothing to do
      });
      return CPU;
    })();
    internal.CPU = CPU;
    
    const GetPageSize = () => RoundUpToPowerOf2(4096);
    
    const OS = (() => {
      function OS() { }
      class_static(OS, "Setup", function() {
        // this method must setup the random seed
        // but no need seeding Math.random
      });

      class_static(OS, "Allocate", function(requested, allocated, executable) {
        let msize = RoundUp(requested, GetPageSize());
        let mbase = alloc(msize);
        
        if (mbase == NULL) {
          // LOG(StringEvent("OS::Allocate", "VirtualAlloc failed"));
          console.log("OS::Allocate", "VirtualAlloc failed");
          return NULL;
         }
         
         allocated[0] = msize;
         UpdateAllocatedSpaceLimits(mbase, msize);
         return mbase;
      });
      return OS;
    })();
    internal.OS = OS;

    let FLAG_semispace_size = 0;
    let FLAG_old_gen_size = 0;
    
    let Flag_semispace_size = new Flag(null, {
      file: "ecma262-v8.js",
      name: "semispace_size",
      comment: "size of (each semispace in) the new generation",
      type: Flag.Type.INT,
      variable: FLAG_semispace_size,
      default_: FlagValue.New_INT(0)
    });

    let Flag_old_gen_size = new Flag(null, {
      file: "ecma262-v8.js",
      name: "old_gen_size",
      comment: "size of the old generation",
      type: Flag.Type.INT,
      variable: FLAG_old_gen_size,
      default_: FlagValue.New_INT(0)
    });

    let heap_configured = false;

    let Heap = (() => {
      function Heap() {
        class_private();
      }
      
      Heap.semispace_size_ = 1 * MB;
      Heap.initial_semispace_size_ = 256 * KB;
      Heap.young_generation_size_ = 0;
      Heap.old_generation_size_ = 512 * MB;
    
      Heap.kMaxMapSpaceSize = 8 * MB;
    
      Heap.new_space_ = NULL;

      class_static(Heap, "Setup", function(create_heap_objects) {
        let _ = Heap;
        if (!heap_configured) {
          if (!Heap.ConfigureHeapDefault())
            return false;
        }
    
        if (!MemoryAllocator.Setup(Heap.maxCapacity()))
          return false;
        let chunk = MemoryAllocator.ReserveInitialChunk(2 * Heap.young_generation_size_);
        if (chunk == NULL)
          return false;
    
        let old_space_start = chunk;
        let new_space_start = old_space_start + RoundUp(old_space_start, Heap.young_generation_size_ / 2);
        let code_space_start = new_space_start + Heap.young_generation_size_;
    
        let old_space_size = new_space_start - old_space_start;
        let code_space_size = this.young_generation_size_ - old_space_size;
    
        // console.log({ old_space_start, new_space_start, code_space_start, old_space_size, code_space_size });
    
        this.new_space_ = new NewSpace(MemoryAlloc(NewSpace.size), {
          initial_semispace_capacity: this.initial_semispace_size_,
          maximum_semispace_capacity: this.semispace_size_,
          id: AllocationSpace.NEW_SPACE,
          executable: false
        });
    
        if (!this.new_space_.Setup(new_space_start, this.young_generation_size_))
          return false;
    
        this.old_space_ = new OldSpace(MemoryAlloc(OldSpace.size), {
          max_capacity: this.old_generation_size_,
          id: AllocationSpace.OLD_SPACE,
          executable: false
        });
    
        if (!this.old_space_.Setup(old_space_start, old_space_size))
          return false;
    
        this.code_space_ = new OldSpace(MemoryAlloc(OldSpace.size), {
          max_capacity: this.old_generation_size_,
          id: AllocationSpace.CODE_SPACE,
          executable: true
        });
    
        if (!this.code_space_.Setup(code_space_start, code_space_size))
          return false;
    
        this.map_space_ = new MapSpace(MemoryAlloc(MapSpace.size), {
          max_capacity: this.kMaxMapSpaceSize,
          id: AllocationSpace.MAP_SPACE
        });
    
        if (!this.map_space_.Setup(Null, 0))
          return false;
    
    
        return true;
      });

      class_static(Heap, "hasBeenSetup", function() {
        return this.new_space_ != null &&
          this.old_space_ != null &&
          this.code_space_ != null &&
          this.map_space_ != null &&
          this.lo_space_ != null;
      });
    
      Heap.maxCapacity = function () {
        return Heap.young_generation_size_ + Heap.old_generation_size_;
      };
    
      Heap.configureHeap = function (semispace_size, old_gen_size) {
        if (Heap.hasBeenSetup()) return false;
    
        if (semispace_size > 0)
          Heap.semispace_size_ = semispace_size;
        if (old_gen_size > 0)
          Heap.old_generation_size_ = old_gen_size;
    
        Heap.semispace_size_ = RoundUpToPowerOf2(Heap.semispace_size_);
        Heap.initial_semispace_size_ = Min(Heap.initial_semispace_size_, Heap.semispace_size_);
        Heap.young_generation_size_ = 2 * Heap.semispace_size_;
    
        Heap.old_generation_size_ = RoundUp(Heap.old_generation_size_, Page.kPageSize);
        heap_configured = true;
    
        return true;
      };
    
      Heap.ConfigureHeapDefault = function () {
        return Heap.configureHeap(FLAG_semispace_size, FLAG_old_gen_size);
      };
      return Heap;
    })();
    internal.Heap = Heap;
    
    const Page = (() => {
      function Page(offset) {
        class_instance(this, offset);
      }

      class_size(Page, 20);
         
      class_properties(Page.prototype, {
        opaque_header: { offset: 0, as: "int" },
        is_normal_page: { offset: 4, as: "int" },
        mc_relocation_top: {
          offset: 8, as: "*"
        },
        mc_page_index: { offset: 12, as: "int" },
        mc_first_forwarded: {
          offset: 16, as: "*"
        }
      });
         
      Page.prototype.address = function() {
        return this.memory.heapOffset + this.memory.byteOffset;
      }
         
      Page.prototype.is_valid = function() {
        return this.address() != Null;
      }
         
      Page.FromAddress = function(a) {
        throw "Page.FromAddress";
        if (a == NULL) return NULL; 
        let memory = MemoryGetBufferAt(OffsetFrom(a & ~this.kPageAlignmentMask, sizeof(Page.size)));
        return new Page(memory);
      };

      Page.kPageSizeBits = 13;
      Page.kPageSize = 1 << Page.kPageSizeBits;
      Page.kPageAlignmentMask = (1 << Page.kPageSizeBits) - 1;

      Page.kRSetEndOffset = Page.kPageSize / kBitsPerPointer;
      Page.kObjectStartOffset = Page.kRSetEndOffset;
      Page.kObjectAreaSize = Page.kPageSize - Page.kObjectStartOffset;
      Page.kMaxHeapObjectSize = Page.kObjectAreaSize;
      return Page;
    })();
    internal.Page = Page;
   
    const MemoryAllocator = (() => {
      function MemoryAllocator() {
        class_private();
      }
      let _ = MemoryAllocator;
      MemoryAllocator.kMaxNofChunks = 1 << Page.kPageSizeBits;
      MemoryAllocator.kPagesPerChunk = 64;
      MemoryAllocator.kChunkSize = MemoryAllocator.kPagesPerChunk * Page.kPageSize;
      MemoryAllocator.capacity_ = 0;
      MemoryAllocator.size_ = 0;
      MemoryAllocator.max_nof_chunks_ = 0;
      MemoryAllocator.top_ = 0;
         
      MemoryAllocator.initial_chunk_ = NULL;

      const ChunkInfo = (() => {
        function ChunkInfo(offset) {
          class_instance(this, offset);
        }
      
        class_method(ChunkInfo.prototype, "init", function(a, s, o) {
          this.address_ = a;
          this.size_ = s;
          this.owner_ = o;
        });
            
        class_size(ChunkInfo, 12);
            
        class_properties(ChunkInfo.prototype, {
          address_: { offset: 0, as: "*"},
          size_: { offset: 4, as: "uint32"},
          owner_: { offset: 8, as: "*"},
        });
        return ChunkInfo;
      })();
      MemoryAllocator.ChunkInfo = ChunkInfo;
         
      let kEstimatedNumberOfChunks = 270;
         
      MemoryAllocator.chunks_ = new List(null, new FreeStoreAllocationPolicy(), sizeof(ChunkInfo), (ptr) => new ChunkInfo(ptr), {
        capacity: kEstimatedNumberOfChunks
      });
      MemoryAllocator.free_chunk_ids_ = new List(null, new FreeStoreAllocationPolicy(), sizeof(4), (ptr) => data.int(ptr), {
        capacity: kEstimatedNumberOfChunks
      });

      MemoryAllocator.Setup = function(capacity) {
        this.capacity_ = RoundUp(capacity, Page.kPageSize);
        this.max_nof_chunks_ = 
          data.int(this.capacity_ / (this.kChunkSize - Page.kPageSize)) + 5;
            
        if (this.max_nof_chunks_ > this.kMaxNofChunks)
          return false;
            
        this.size_ = 0;
        let info = new ChunkInfo(null);
            
        for (let i = data.int(this.max_nof_chunks_ - 1); i >= 0; i.decrease()) {
          this.chunks_.Add(info);
          this.free_chunk_ids_.Add(i);
        }
        this.top_ = this.max_nof_chunks_;
        return true;
      };
         
      MemoryAllocator.ReserveInitialChunk = function(requested) {
        this.initial_chunk_ = new VirtualMemory(null, { requested });
        if (!this.initial_chunk_.IsReserved()) {
          this.initial_chunk_ = NULL;
          return NULL;
        }
            
        this.size_ += requested;
        return this.initial_chunk_.address();
      };
         
      MemoryAllocator.commitBlock = function(start, size, executable) {
        if (!this.initial_chunk_.Commit(start, size, executable))
          return false;
        Counters.memory_allocated.increment(size);
        return true;
      };
         
         MemoryAllocator.CommitPages = function(start, size, owner, num_pages) {
            console.log("MemoryAllocator.CommitPages", start);
            num_pages[0] = PagesInChunk(start, size);
            
            if (!this.initial_chunk_.Commit(start, size, owner.executable())) {
               return Page.FromAddress(Null);
            }
            Counters.memory_allocated.increment(size);
            let chunk_id = this.pop();
            
            this.chunks_.at(chunk_id).init(start, size, owner);
            return MemoryAllocator.InitializePagesInChunk(chunk_id, num_pages, owner);
         };
         
         MemoryAllocator.InitializePagesInChunk = function(chunk_id, pages_in_chunk, owner) {
            let chunk_start = this.chunks_.at(chunk_id).address();
            let low = RoundUp(chunk_start, Page.kPageSize);
            let page_addr = low;
            
            for (let i = 0; i < pages_in_chunk[0]; i++) {
               let p = Page.FromAddress(page_addr);
               
               p.opaque_header = (OffsetFrom(page_addr + Page.kPageSize) | chunk_id);
               p.is_normal_page = 1;
               page_addr += Page.kPageSize;
            }

            let last_page = Page.FromAddress(page_addr - Page.kPageSize);
            last_page.opaque_header = (OffsetFrom(0) | chunk_id);
            return Page.FromAddress(low);
         };
         
         MemoryAllocator.pop = function() {
            return this.free_chunk_ids_.at(--this.top_).toNumber();
         }
         
         MemoryAllocator.AllocatePages = function(requested_pages, allocated_pages, owner) {
            if (requested_pages <= 0) return Page.FromAddress(Null);
            let chunk_size = requested_pages * Page.kPageSize;
            
            if (this.size_ + int32(chunk_size) > this.capacity_) {
               chunk_size = this.capacity_ - this.size_;
               requested_pages = chunk_size >> Page.kPageSizeBits;

               if (requested_pages <= 0) return Page.FromAddress(Null);
            }
            
            let chunk_size_p = [chunk_size];
            let chunk = this.AllocateRawMemory(chunk_size, chunk_size_p, owner.executable());
            if (chunk == Null) return Page.FromAddress(Null);

            chunk_size = chunk_size_p[0];

            allocated_pages[0] = PagesInChunk(chunk, chunk_size);

            if (allocated_pages[0] == 0) {
               this.FreeRawMemory(chunk, chunk_size);
               return Page.FromAddress(Null);
            }
            
            let chunk_id = this.pop();
            this.chunks_.at(chunk_id).init(chunk, chunk_size, owner);
            return this.InitializePagesInChunk(chunk_id, allocated_pages[0], owner);
         }

         MemoryAllocator.AllocateRawMemory = function(requested, allocated, executable) {
            if (this.size_ + int32(requested) > this.capacity_) return Null;

            let mem = OS.Allocate(requested, allocated, executable);
            let alloced = allocated[0];
            this.size_ += alloced;
            Counters.memory_allocated.increment(alloced);
            return mem;
         };
         
         return MemoryAllocator;
      })();
      internal.MemoryAllocator = MemoryAllocator;
    
    const VirtualMemory = (() => {
      function VirtualMemory(offset, params) {
        class_instance(this, offset, params);
      }
      
      class_constructor(VirtualMemory, function({ size, address_hint = NULL}) {
        this.address_ = reserve(address_hint, size);
        this.size_ = size;
      });

      class_method(VirtualMemory.prototype, "IsReserved", function() {
        return this.address_ != NULL;
      });

      class_method(VirtualMemory.prototype, "address", function() {
        return this.address_;
      });

      class_method(VirtualMemory.prototype, "size", function() {
        return this.size_;
      });
      
      class_method(VirtualMemory.prototype, "Commit0", function(address, size, executable) {
        if (NULL == commit(address, size)) {
          return false;
        }
        UpdateAllocatedSpaceLimits(address, size);
        return true;
      });
      
      class_size(VirtualMemory, 8);
      return VirtualMemory;
    })();
    internal.VirtualMemory = VirtualMemory;
    
  });  // end of internal namespace

  var i = v8.internal;

  

  function CheckHelper(file, line, source, condition) {
    if (!condition)
      V8_Fatal(file, line, "CHECK(" + source + ") failed");
  }

  function CHECK(condition, condition_str) {
    CheckHelper("", "", condition_str, condition);
  }

  /**
   * 
   * @param {boolean} condition 
   * @param {string} condition_str 
   */
  function ASSERT(condition, condition_str) {
    CHECK(condition, condition_str);
  }
  
  const Flag_stack_trace_on_abort = new i.Flag(null, {
    file: "FILE", 
    name: "stack_trace_on_abort",
    comment: "print a stack trace if an assertion failure occurs",
    type: i.Flag.Type.BOOL,
    variable: FLAG_stack_trace_on_abort,
    default_: i.FlagValue.New_BOOL(true)
  });
   
   // checks

  function API_Fatal(location, format) {
    throw new Error("\n#\n# Fatal error in " + location + "\n# " + format + "\n#");
  }

  let has_shut_down = false;
  let exception_behavior = null;

  const DefaultFatalErrorHandler = function (location, message) {
    API_Fatal(location, message);
  };

  function GetFatalErrorHandler() {
    if (exception_behavior == null) {
      exception_behavior = DefaultFatalErrorHandler;
    }
    return exception_behavior;
  }

  function ReportV8Dead(location) {
    let callback = GetFatalErrorHandler();
    callback(location, "V8 is no longer useable");
    return true;
  }

  function IsDeadCheck(location) {
    return has_shut_down ?
      ReportV8Dead(location) : false;
  }

  function ApiCheck(condition, location, message) {
    return condition ? true : Utils.reportApiFailure(location, message);
  }

  function EnsureInitialized(location) {
    if (IsDeadCheck(location)) return true;
    ApiCheck(v8.V8.Initialize(), location, "Error initializing V8");
  }

  const Utils = (function () {
    function Utils() { }
    
    class_static(Utils, "reportApiFailure", function (location, message) {
      let callback = GetFatalErrorHandler();
      callback(location, message);
      has_shut_down = true;
      return false;
    });
    
    return Utils;
  })();

  const V8 = (function () {
    function V8() { }

    class_static(V8, "SetFlagsFromCommandLine", function (argv, remove_flags) {
      i.FlagList.setFlagsFromCommandLine(argv, remove_flags);
    });

    class_static(V8, "Initialize", function () {
      if (i.V8.HasBeenSetup()) return true;
      let scope = new HandleScope();
      
      if (i.Snapshot.Initialize()) {
        i.Serializer.Disable();
        return true;
      } else {
        return i.V8.Initialize(null);
      }
    });

    return V8;
  })();
  v8.V8 = V8;

  const HandleScope = (function () {
    function HandleScope(offset) {
      class_instance(this, offset, () => {
        this.previous_ = HandleScope.current_;
        this.is_closed_ = false;
        HandleScope.current_.extensions = 0;
      });
    }

    class_size(HandleScope, 16);

    const Data = (function () {
      function Data(offset) {
        class_instance(this, offset);
      }

      class_size(Data, 12);

      class_properties(Data.prototype, {
        extensions: { offset: 0, as: "int" },
        next: {
          offset: 4, as: "*",
          constructor(ptr) {
            let ptr2 = uint32[offsetof(ptr) >> 2];
            return pointer(ptr2, 0);
          }
        },
        limit: {
          offset: 8, as: "*",
          constructor(ptr) {
            let ptr2 = uint32[offsetof(ptr) >> 2];
            return pointer(ptr2, 0);
          }
        }
      });

      class_method(Data.prototype, "Initialize", function() {
        this.extensions = -1;
        this.next = this.limit = NULL;
      });
      
      return Data;
    })();
    HandleScope.Data = Data;

    class_properties(HandleScope.prototype, {
      previous_: {
        offset: 0, as: "&",
        byteLength: sizeof(Data),
        constructor(ptr) {
          return new Data(ptr);
        }
      },
      is_closed_: {
        offset: 12, as: "bool"
      }
    });

    const data = new Data(null);
    data.extensions = -1;
    data.next = NULL;
    data.limit = NULL;
    
    HandleScope.current_ = data;

    return HandleScope;
  })();
  v8.HandleScope = HandleScope;

  var Handle = (function () {
    function Handle(offset, { val }) {
      class_instance(this, offset, () => {
        if (val)
          this.val_ = val;
      });
    }

    class_size(Handle, 4);

    class_property(Handle.prototype, "val_", {
      offset: 0,
      as: "*",
      constructor(ptr) {
        return ptr;
      }
    });

    return Handle;
  })();
  v8.Handle = Handle;
  
  var Local = (function () {
    function Local(offset) {
      class_instance(this, offset, () => {
        Handle.call(this, pointer(offsetof(this)), {});
      });
    }

    class_size(Local, 4);
    class_extend(Local, Handle);
    
    return Local;
  })();
  
  var Data = (function () {
    function Data() { }
    class_size(Data, 0);
    return Data;
  })();
  v8.Data = Data;
  
  var Template = (function () {
    function Template(offset) {
      class_instance(this, offset, () => {
        Data.call(this);
      });
    }
    class_size(Template, 0);
    class_extend(Template, Data);
    return Template;
  })();
  v8.Template = Template;
  
  var ObjectTemplate = (function () {
    function ObjectTemplate(offset) {
      class_instance(this, offset, () => {
        Template.call(this);
      });
    }
    class_size(ObjectTemplate, 0);
    class_extend(ObjectTemplate, Template);
    
    ObjectTemplate.New = function () {
      let constructor = new Local();
      if (IsDeadCheck("v8::ObjectTemplate::New()"))
        return new Local();
      EnsureInitialized("v8::ObjectTemplate::New()");
    };
    return ObjectTemplate;
  })();
  v8.ObjectTemplate = ObjectTemplate;
  let list = new i.List(null, new i.FreeStoreAllocationPolicy(null), 4, (ptr) => data.int(ptr), {
    capacity: 10
  });
  console.log(list, list.data_, list.capacity_, list.length_);
  return v8;
});

const { V8, HandleScope, ObjectTemplate } = v8;

const main = (args) => {
  V8.SetFlagsFromCommandLine(args, true);
  const handle_scope = new HandleScope();
  const global = ObjectTemplate.New();

  console.log({handle_scope, global});
}
main("");