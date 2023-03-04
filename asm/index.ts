namespace v8 {
  namespace internal {
    type Address = usize;

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
  
    const Max = (a: i32, b: i32) => a < b ? b : a;
    const Min = (a: i32, b: i32) => a < b ? a : b;
  
    const OffsetFrom = (x: i32) => x - 0;
    const AddressFrom = (x: i32) => (0 + x);
  
    const RoundDown = (x: i32, m: i32) => AddressFrom(OffsetFrom(x) & -m);
    const RoundUp = (x: i32, m: i32) => RoundDown(x + m - 1, m);
  
    const RoundUpToPowerOf2 = (x: i32) => {
      x = x - 1;
      x = x | (x >> 1);
      x = x | (x >> 2);
      x = x | (x >> 4);
      x = x | (x >> 8);
      x = x | (x >> 16);
      return x + 1;
    }

    const HAS_HEAP_OBJECT_TAG = (value: usize) => (value & kHeapObjectTagMask) == kHeapObjectTag;

    enum AllocationSpace {
      NEW_SPACE,
      OLD_SPACE,
      CODE_SPACE,
      MAP_SPACE,
      LO_SPACE,

      FIRST_SPACE = NEW_SPACE,
      LAST_SPACE = LO_SPACE
    }

    @unmanaged class FlagValue {
      value: usize = 0;

      New_BOOL(b: bool) {
        store<bool>(changetype<usize>(this), b);
      }

      New_INT(i: i32) {
        store<i32>(changetype<usize>(this), i);
      }

      New_FLOAT(f: f32) {
        store<f32>(changetype<usize>(this), f);
      }

      New_STRING(s: string) {
        store<string>(changetype<usize>(this), s);
      }
    }


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

    enum StringRepresentationTag {
      kSeqStringTag = 0x0,
      kConsStringTag = 0x1,
      kSlicedStringTag = 0x2,
      kExternalStringTag = 0x3
    };

    enum InstanceType {
      SHORT_SYMBOL_TYPE = kShortStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag,
      MEDIUM_SYMBOL_TYPE = kMediumStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag,
      LONG_SYMBOL_TYPE = kLongStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag,
      SHORT_ASCII_SYMBOL_TYPE = kShortStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag,
      MEDIUM_ASCII_SYMBOL_TYPE = kMediumStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag,
      LONG_ASCII_SYMBOL_TYPE = kLongStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSeqStringTag,
      SHORT_CONS_SYMBOL_TYPE = kShortStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag,
      MEDIUM_CONS_SYMBOL_TYPE = kMediumStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag,
      LONG_CONS_SYMBOL_TYPE = kLongStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag,
      SHORT_CONS_ASCII_SYMBOL_TYPE = kShortStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag,
      MEDIUM_CONS_ASCII_SYMBOL_TYPE = kMediumStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag,
      LONG_CONS_ASCII_SYMBOL_TYPE = kLongStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kConsStringTag,
      SHORT_SLICED_SYMBOL_TYPE = kShortStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag,
      MEDIUM_SLICED_SYMBOL_TYPE = kMediumStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag,
      LONG_SLICED_SYMBOL_TYPE = kLongStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag,
      SHORT_SLICED_ASCII_SYMBOL_TYPE = kShortStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag,
      MEDIUM_SLICED_ASCII_SYMBOL_TYPE = kMediumStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag,
      LONG_SLICED_ASCII_SYMBOL_TYPE = kLongStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kSlicedStringTag,
      SHORT_EXTERNAL_SYMBOL_TYPE = kShortStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag,
      MEDIUM_EXTERNAL_SYMBOL_TYPE = kMediumStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag,
      LONG_EXTERNAL_SYMBOL_TYPE = kLongStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag,
      SHORT_EXTERNAL_ASCII_SYMBOL_TYPE = kShortStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag,
      MEDIUM_EXTERNAL_ASCII_SYMBOL_TYPE = kMediumStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag,
      LONG_EXTERNAL_ASCII_SYMBOL_TYPE = kLongStringTag | kAsciiStringTag | kSymbolTag | StringRepresentationTag.kExternalStringTag,
      SHORT_STRING_TYPE = kShortStringTag | StringRepresentationTag.kSeqStringTag,
      MEDIUM_STRING_TYPE = kMediumStringTag | StringRepresentationTag.kSeqStringTag,
      LONG_STRING_TYPE = kLongStringTag | StringRepresentationTag.kSeqStringTag,
      SHORT_ASCII_STRING_TYPE = kShortStringTag | kAsciiStringTag | StringRepresentationTag.kSeqStringTag,
      MEDIUM_ASCII_STRING_TYPE = kMediumStringTag | kAsciiStringTag | StringRepresentationTag.kSeqStringTag,
      LONG_ASCII_STRING_TYPE = kLongStringTag | kAsciiStringTag | StringRepresentationTag.kSeqStringTag,
      SHORT_CONS_STRING_TYPE = kShortStringTag | StringRepresentationTag.kConsStringTag,
      MEDIUM_CONS_STRING_TYPE = kMediumStringTag | StringRepresentationTag.kConsStringTag,
      LONG_CONS_STRING_TYPE = kLongStringTag | StringRepresentationTag.kConsStringTag,
      SHORT_CONS_ASCII_STRING_TYPE = kShortStringTag | kAsciiStringTag | StringRepresentationTag.kConsStringTag,
      MEDIUM_CONS_ASCII_STRING_TYPE = kMediumStringTag | kAsciiStringTag | StringRepresentationTag.kConsStringTag,
      LONG_CONS_ASCII_STRING_TYPE = kLongStringTag | kAsciiStringTag | StringRepresentationTag.kConsStringTag,
      SHORT_SLICED_STRING_TYPE = kShortStringTag | StringRepresentationTag.kSlicedStringTag,
      MEDIUM_SLICED_STRING_TYPE = kMediumStringTag | StringRepresentationTag.kSlicedStringTag,
      LONG_SLICED_STRING_TYPE = kLongStringTag | StringRepresentationTag.kSlicedStringTag,
      SHORT_SLICED_ASCII_STRING_TYPE = kShortStringTag | kAsciiStringTag | StringRepresentationTag.kSlicedStringTag,
      MEDIUM_SLICED_ASCII_STRING_TYPE = kMediumStringTag | kAsciiStringTag | StringRepresentationTag.kSlicedStringTag,
      LONG_SLICED_ASCII_STRING_TYPE = kLongStringTag | kAsciiStringTag | StringRepresentationTag.kSlicedStringTag,
      SHORT_EXTERNAL_STRING_TYPE = kShortStringTag | StringRepresentationTag.kExternalStringTag,
      MEDIUM_EXTERNAL_STRING_TYPE = kMediumStringTag | StringRepresentationTag.kExternalStringTag,
      LONG_EXTERNAL_STRING_TYPE = kLongStringTag | StringRepresentationTag.kExternalStringTag,
      SHORT_EXTERNAL_ASCII_STRING_TYPE = kShortStringTag | kAsciiStringTag | StringRepresentationTag.kExternalStringTag,
      MEDIUM_EXTERNAL_ASCII_STRING_TYPE = kMediumStringTag | kAsciiStringTag | StringRepresentationTag.kExternalStringTag,
      LONG_EXTERNAL_ASCII_STRING_TYPE = kLongStringTag | kAsciiStringTag | StringRepresentationTag.kExternalStringTag,
      LONG_PRIVATE_EXTERNAL_ASCII_STRING_TYPE = 75, //LONG_EXTERNAL_ASCII_STRING_TYPE,
  
      MAP_TYPE = kNotStringTag,
      HEAP_NUMBER_TYPE = 129,
      FIXED_ARRAY_TYPE = 130,
      CODE_TYPE = 131,
      ODDBALL_TYPE = 132,
      PROXY_TYPE = 133,
      BYTE_ARRAY_TYPE = 134,
      FILLER_TYPE = 135,
      SMI_TYPE = 136,
  
      ACCESSOR_INFO_TYPE = 137,
      ACCESS_CHECK_INFO_TYPE = 138,
      INTERCEPTOR_INFO_TYPE = 139,
      SHARED_FUNCTION_INFO_TYPE = 140,
      CALL_HANDLER_INFO_TYPE = 141,
      FUNCTION_TEMPLATE_INFO_TYPE = 142,
      OBJECT_TEMPLATE_INFO_TYPE = 143,
      SIGNATURE_INFO_TYPE = 144,
      TYPE_SWITCH_INFO_TYPE = 145,
      DEBUG_INFO_TYPE = 146,
      BREAK_POINT_INFO_TYPE = 147,
      SCRIPT_TYPE = 148,
  
      JS_OBJECT_TYPE = 149,
      JS_GLOBAL_OBJECT_TYPE = 150,
      JS_BUILTINS_OBJECT_TYPE = 151,
      JS_VALUE_TYPE = 152,
      JS_ARRAY_TYPE = 153,
  
      JS_FUNCTION_TYPE = 154,
  
      FIRST_NONSTRING_TYPE = 128,
      FIRST_TYPE = 0x0,
      LAST_TYPE = 154,
      FIRST_JS_OBJECT_TYPE = 149,
      LAST_JS_OBJECT_TYPE = 153,
    };

    @unmanaged class Object_ {
      IsHeapObject(): bool {
        return HAS_HEAP_OBJECT_TAG(changetype<usize>(this));
      }

      IsFailure(): bool {
        return (changetype<usize>(this) & kFailureTagMask) == kFailureTag
      }

      IsMap(): bool {
        return this.IsHeapObject(); // For implementation
      }

      static kSize: i32 = 0;
    }

    function FIELD_ADDR(p: usize, offset: i32): usize {
      return p + offset - kHeapObjectTag;
    }

    function READ_FIELD(p: usize, offset: i32): Object_ {
      return changetype<Object_>(FIELD_ADDR(p, offset));
    }

    function WRITE_FIELD(p: usize, offset: i32, value: usize) {
      store<usize>(FIELD_ADDR(p, offset), value);
    }

    function WRITE_INT_FIELD(p: usize, offset: i32, value: i32) {
      store<i32>(FIELD_ADDR(p, offset), value);
    }

    function READ_INT_FIELD(p: usize, offset: i32): i32 {
      return changetype<i32>(FIELD_ADDR(p, offset));
    }

    function READ_BYTE_FIELD(p: usize, offset: i32) {
      return changetype<u8>(FIELD_ADDR(p, offset));
    }

    function WRITE_BYTE_FIELD(p: usize, offset: i32, value: u8) {
      store<u8>(changetype<u8>(FIELD_ADDR(p, offset)), value);
    }

    @unmanaged export class HeapObject extends Object_ {
      static FromAddress(address: Address) {
        return changetype<HeapObject>(address + kHeapObjectTag);
      }

      static cast(object: Object_): HeapObject {
        return changetype<HeapObject>(changetype<usize>(object));
      }

      static kMapOffset = Object_.kSize;
      static kSize = HeapObject.kMapOffset + kPointerSize;
    }

    @unmanaged export class Map extends HeapObject {
      static kInstanceAttributesOffset = HeapObject.kSize;
      static kPrototypeOffset = Map.kInstanceAttributesOffset + kIntSize;
      static kConstructorOffset = Map.kPrototypeOffset + kPointerSize;
      static kInstanceDescriptorsOffset = Map.kConstructorOffset + kPointerSize;
      static kCodeCacheOffset = Map.kInstanceDescriptorsOffset + kPointerSize;
      static kSize = Map.kCodeCacheOffset + kIntSize;

      static kInstanceSizeOffset = Map.kInstanceAttributesOffset + 0;
      static kInstanceTypeOffset = Map.kInstanceAttributesOffset + 1;
      static kUnusedPropertyFieldsOffset = Map.kInstanceAttributesOffset + 2;
      static kBitFieldOffset = Map.kInstanceAttributesOffset + 3;
    }

    @unmanaged export class MapWord {
      value_: usize = 0;

      constructor(value: usize) {
        this.value_ = value;
      }
    }


    @unmanaged export class Array extends HeapObject {
      static kLengthOffset = HeapObject.kSize;
      static kHeaderSize = Array.kLengthOffset + kIntSize;
    }

    @unmanaged export class FixedArray extends Array {
      static cast(object: Object_) {
        return changetype<Object_>(changetype<usize>(object));
      }
    }

    @unmanaged export class Oddball extends HeapObject {
      static kToStringOffset = HeapObject.kSize;
      static kToNumberOffset = Oddball.kToStringOffset + kPointerSize;
      static kSize = Oddball.kToNumberOffset + kPointerSize;
    }

    class Logger {
      static Setup() {
        return false;
      }
    }

    class CPU {
      static Setup() {
        
      }
    }

    class Deserializer {
      GetLog() {

      }
    }

    let lowest_ever_allocated: Address = -1;
    let highest_ever_allocated: Address = 0;
    
    function UpdateAllocatedSpaceLimits(address: Address, size: usize) {
      lowest_ever_allocated = Min(lowest_ever_allocated, address);
      highest_ever_allocated = Max(highest_ever_allocated, (address + size));
    }

    class OS {
      static Setup() {

      }

      static Allocate(requested: i32, allocated: usize) {
        const msize = RoundUp(requested, GetPageSize());
        let mbase = heap.alloc(msize);

        if (mbase == 0) {
          //LOG(StringEvent("OS::Allocate", "VirtualAlloc failed"));
          return 0;
        }

        store<i32>(allocated, msize);
        UpdateAllocatedSpaceLimits(mbase, msize);
        return mbase;
      }
    }

    function GetPageSize() {
      return 4096; // 32 bit
    }

    class V8 {
      static has_been_setup_ = false;
      static has_been_disposed_ = false;

      static HasBeenSetup() {
        return this.has_been_setup_;
      }

      static HasBeenDisposed() {
        return this.has_been_disposed_;
      }

      static Initialize(des: Deserializer | null) {
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
      }
    }

    @unmanaged export class Page {
      opaque_header: i32 = 0;
      is_normal_page: i32 = 0;
      mc_relocation_top: Address = 0;
      mc_page_index: i32 = 0;
      mc_first_forwarded: Address = 0;

      static kPageSizeBits = 13;
      static kPageSize = 1 << Page.kPageSizeBits;
      static kPageAlignmentMask = (1 << Page.kPageSizeBits) - 1;
      static kRSetEndOffset = Page.kPageSize / kBitsPerPointer;
      static kRSetStartOffset = Page.kRSetEndOffset / kBitsPerPointer;
      static kObjectStartOffset = Page.kRSetEndOffset;
      static kObjectAreaSize = Page.kPageSize - Page.kObjectStartOffset;
      static kMaxHeapObjectSize = Page.kObjectAreaSize;

      static FromAddress(a: Address) {
        return changetype<Page>(a & ~Page.kPageAlignmentMask);
      }
    }

    export class Malloced {
      static New(size: usize): usize {
        return heap.alloc(size);
      }

      static Delete(ptr: usize): void {
        heap.free(ptr);
      }
    }

    export class FreeStoreAllocationPolicy {
      static New(size: usize) {
        return Malloced.New(size);
      }
      
      static Delete(ptr: usize) {
        return Malloced.Delete(ptr);
      }
    }

    export class StatsCounter {
      name_: string = "";
      lookup_done_: bool = false;
      ptr_: usize = 0;
      id_: i32 = 0;

      constructor(name: string, id: i32) {
        this.id_ = id;
        this.name_ = "c:" + name;
      }
    }

    class Counters {
      //static memory_allocated = new StatsCounter();
    }

    class ChunkInfo {

    }

    export class List<T> {
      data_: usize = 0;
      capacity_: i32 = 0;
      length_: i32 = 0;

      constructor(capacity: u32) {
        this.Initialize(capacity);
      }

      Initialize(capacity: u32) {
        this.data_ = (capacity > 0) ? this.NewData(capacity) : 0
      }

      NewData(n: u32) {
        return FreeStoreAllocationPolicy.New(n * sizeof<ChunkInfo>());
      }

      Add(element: T) {

      }
    }

    export class VirtualMemory {
      address_: usize = 0;
      size_: i32 = 0;

      constructor(size: u32) {
        this.address_ = heap.alloc(size);
        this.size_ = size;
      }

      IsReserved(): bool {
        return this.address_ != 0;
      }
    }

    class MemoryAllocator {
      static capacity_: i32 = 0;
      static max_nof_chunks_: i32 = 0;
      static size_: i32 = 0;
      static kMaxNofChunks = 1 << Page.kPageSizeBits;

      static kPagesPerChunk = 64;
      static kChunkSize = MemoryAllocator.kPagesPerChunk * Page.kPageSize;

      static kEstimatedNumberOfChunks = 1049; //270;

      static chunks_ = new List<ChunkInfo>(MemoryAllocator.kEstimatedNumberOfChunks);
      static free_chunk_ids_ = new List<i32>(MemoryAllocator.kEstimatedNumberOfChunks);

      static top_ = 0;

      static Setup(capacity: i32) {
        this.capacity_ = RoundUp(capacity, Page.kPageSize);
        this.max_nof_chunks_ = (this.capacity_ / (this.kChunkSize - Page.kPageSize) + 5);

        if (this.max_nof_chunks_ > this.kMaxNofChunks) return false;
        
        this.size_ = 0;
        
        let info = new ChunkInfo();
        for (let i = this.max_nof_chunks_ - 1; i >= 0; i--) {
          this.chunks_.Add(info);
          this.free_chunk_ids_.Add(i);
        }
        this.top_ = this.max_nof_chunks_;
        return true;
      }
    }

    class AllocationInfo {
      top: Address = 0;
      limit: Address = 0;
    }

    class Heap {
      static Setup(b: bool): bool {
        return true;
      }
    }
  }
}

export function main(): i32 {

  return 0;
}
