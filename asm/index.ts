declare namespace console {
  export function log(msg: string, num: i32, b: bool): void;
}

class Pointer<T> {
  address: usize;

  constructor(addr: usize = -1) {
    this.address = addr == -1 ? heap.alloc(sizeof<T>()) : addr;
  }

  deref(value: T | null = null): T {
    if (value != null) {
      store<T>(this.address, value);
      return value;
    }
    return changetype<T>(this.address);
  }
}

class array<T> {
  [key: number]: T;
  start: usize = NULL;
  length: i32 = 0;

  constructor(length: i32) {
    this.start = heap.alloc(sizeof<T>() * length);
    this.length = length;
  }

  @operator("[]") __get(index: i32): T {
    if (index >= this.length)
      throw new Error("Array index out of bounds.");
    return changetype<T>(this.start + (sizeof<T>() * index));
  }

  @operator("[]=") __set(index: i32, value: T): void {
    if (index >= this.length)
      throw new Error("Array index out of bounds.");
    store<T>(this.start + (sizeof<T>() *index), value);
  }
}

var NULL: usize = 0;

namespace v8 {
  export namespace internal {
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
  
    function Max(a: i32, b: i32): i32 {
      return a < b ? b : a;
    }

    function max<T extends number>(a: T, b: T): T {
      return a < b ? b : a;
    }

    function Min(a: i32, b: i32): i32 {
      return a < b ? a : b;
    }

    function min<T extends number>(a: T, b: T): T {
      return a < b ? a : b;
    }

    function OffsetFrom(x: i32): i32 {
      return x - 0;
    }

    function AddressFrom(x: i32): i32 {
      return (0 + x);
    }

    function RoundDown(x: i32, m: i32): i32 {
      return AddressFrom(OffsetFrom(x) & -m);
    }

    function RoundUp(x: i32, m: i32): i32 {
      return RoundDown(x + m - 1, m);
    }

    function offsetfrom<T extends number>(x: T): i32 {
      return <i32>(x - <T>0);
    }

    function addressfrom<T extends number>(x: i32): T {
      return <T>(<T> 0 + x);
    }

    function rounddown<T extends number>(x: T, m: i32):  T {
      return addressfrom<T>(offsetfrom(x) & -m);
    }

    function roundup<T extends number>(x: T, m: i32): T {
      return <T>rounddown(x + m - 1, m);
    }

    function RoundUpToPowerOf2(x: u32): u32 {
      x = x - 1;
      x = x | (x >> 1);
      x = x | (x >> 2);
      x = x | (x >> 4);
      x = x | (x >> 8);
      x = x | (x >> 16);
      return x + 1;
    }

    function HAS_HEAP_OBJECT_TAG(value: usize): bool {
      return (value & kHeapObjectTagMask) == kHeapObjectTag;
    }

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

      static New_BOOL(b: bool): FlagValue {
        let v = new FlagValue();
        store<bool>(changetype<usize>(v), b);
        return v;
      }

      static New_INT(i: i32): FlagValue {
        let v = new FlagValue();
        store<i32>(changetype<usize>(v), i);
        return v;
      }

      static New_FLOAT(f: f32): FlagValue {
        let v = new FlagValue();
        store<f32>(changetype<usize>(v), f);
        return v;
      }

      static New_STRING(s: string): FlagValue {
        let v = new FlagValue();
        store<string>(changetype<usize>(v), s);
        return v;
      }
    }


    const kIsNotStringMask: i32 = 0x80;
    const kStringTag: i32 = 0x0;
    const kNotStringTag: i32 = 0x80;

    const kStringSizeMask: i32 = 0x60;
    const kShortStringTag: i32 = 0x0;
    const kMediumStringTag: i32 = 0x20;
    const kLongStringTag: i32 = 0x40;

    const kIsSymbolMask: i32 = 0x10;
    const kNotSymbolTag: i32 = 0x0;
    const kSymbolTag: i32 = 0x10;

    const kStringEncodingMask: i32 = 0x8;
    const kTwoByteStringTag: i32 = 0x0;
    const kAsciiStringTag: i32 = 0x8;

    const kStringRepresentationMask: i32 = 0x07;

    export enum StringRepresentationTag {
      kSeqStringTag = 0x0,
      kConsStringTag = 0x1,
      kSlicedStringTag = 0x2,
      kExternalStringTag = 0x3
    };

    enum InstanceType {
      SHORT_SYMBOL_TYPE = kShortStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kSeqStringTag,
      MEDIUM_SYMBOL_TYPE = kMediumStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kSeqStringTag,
      LONG_SYMBOL_TYPE = kLongStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kSeqStringTag,
      SHORT_ASCII_SYMBOL_TYPE = kShortStringTag | kAsciiStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kSeqStringTag,
      MEDIUM_ASCII_SYMBOL_TYPE = kMediumStringTag | kAsciiStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kSeqStringTag,
      LONG_ASCII_SYMBOL_TYPE = kLongStringTag | kAsciiStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kSeqStringTag,
      SHORT_CONS_SYMBOL_TYPE = kShortStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kConsStringTag,
      MEDIUM_CONS_SYMBOL_TYPE = kMediumStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kConsStringTag,
      LONG_CONS_SYMBOL_TYPE = kLongStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kConsStringTag,
      SHORT_CONS_ASCII_SYMBOL_TYPE = kShortStringTag | kAsciiStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kConsStringTag,
      MEDIUM_CONS_ASCII_SYMBOL_TYPE = kMediumStringTag | kAsciiStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kConsStringTag,
      LONG_CONS_ASCII_SYMBOL_TYPE = kLongStringTag | kAsciiStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kConsStringTag,
      SHORT_SLICED_SYMBOL_TYPE = kShortStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kSlicedStringTag,
      MEDIUM_SLICED_SYMBOL_TYPE = kMediumStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kSlicedStringTag,
      LONG_SLICED_SYMBOL_TYPE = kLongStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kSlicedStringTag,
      SHORT_SLICED_ASCII_SYMBOL_TYPE = kShortStringTag | kAsciiStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kSlicedStringTag,
      MEDIUM_SLICED_ASCII_SYMBOL_TYPE = kMediumStringTag | kAsciiStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kSlicedStringTag,
      LONG_SLICED_ASCII_SYMBOL_TYPE = kLongStringTag | kAsciiStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kSlicedStringTag,
      SHORT_EXTERNAL_SYMBOL_TYPE = kShortStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kExternalStringTag,
      MEDIUM_EXTERNAL_SYMBOL_TYPE = kMediumStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kExternalStringTag,
      LONG_EXTERNAL_SYMBOL_TYPE = kLongStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kExternalStringTag,
      SHORT_EXTERNAL_ASCII_SYMBOL_TYPE = kShortStringTag | kAsciiStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kExternalStringTag,
      MEDIUM_EXTERNAL_ASCII_SYMBOL_TYPE = kMediumStringTag | kAsciiStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kExternalStringTag,
      LONG_EXTERNAL_ASCII_SYMBOL_TYPE = kLongStringTag | kAsciiStringTag | kSymbolTag | v8.internal.StringRepresentationTag.kExternalStringTag,
      SHORT_STRING_TYPE = kShortStringTag | v8.internal.StringRepresentationTag.kSeqStringTag,
      MEDIUM_STRING_TYPE = kMediumStringTag | v8.internal.StringRepresentationTag.kSeqStringTag,
      LONG_STRING_TYPE = kLongStringTag | v8.internal.StringRepresentationTag.kSeqStringTag,
      SHORT_ASCII_STRING_TYPE = kShortStringTag | kAsciiStringTag | v8.internal.StringRepresentationTag.kSeqStringTag,
      MEDIUM_ASCII_STRING_TYPE = kMediumStringTag | kAsciiStringTag | v8.internal.StringRepresentationTag.kSeqStringTag,
      LONG_ASCII_STRING_TYPE = kLongStringTag | kAsciiStringTag | v8.internal.StringRepresentationTag.kSeqStringTag,
      SHORT_CONS_STRING_TYPE = kShortStringTag | v8.internal.StringRepresentationTag.kConsStringTag,
      MEDIUM_CONS_STRING_TYPE = kMediumStringTag | v8.internal.StringRepresentationTag.kConsStringTag,
      LONG_CONS_STRING_TYPE = kLongStringTag | v8.internal.StringRepresentationTag.kConsStringTag,
      SHORT_CONS_ASCII_STRING_TYPE = kShortStringTag | kAsciiStringTag | v8.internal.StringRepresentationTag.kConsStringTag,
      MEDIUM_CONS_ASCII_STRING_TYPE = kMediumStringTag | kAsciiStringTag | v8.internal.StringRepresentationTag.kConsStringTag,
      LONG_CONS_ASCII_STRING_TYPE = kLongStringTag | kAsciiStringTag | v8.internal.StringRepresentationTag.kConsStringTag,
      SHORT_SLICED_STRING_TYPE = kShortStringTag | v8.internal.StringRepresentationTag.kSlicedStringTag,
      MEDIUM_SLICED_STRING_TYPE = kMediumStringTag | v8.internal.StringRepresentationTag.kSlicedStringTag,
      LONG_SLICED_STRING_TYPE = kLongStringTag | v8.internal.StringRepresentationTag.kSlicedStringTag,
      SHORT_SLICED_ASCII_STRING_TYPE = kShortStringTag | kAsciiStringTag | v8.internal.StringRepresentationTag.kSlicedStringTag,
      MEDIUM_SLICED_ASCII_STRING_TYPE = kMediumStringTag | kAsciiStringTag | v8.internal.StringRepresentationTag.kSlicedStringTag,
      LONG_SLICED_ASCII_STRING_TYPE = kLongStringTag | kAsciiStringTag | v8.internal.StringRepresentationTag.kSlicedStringTag,
      SHORT_EXTERNAL_STRING_TYPE = kShortStringTag | v8.internal.StringRepresentationTag.kExternalStringTag,
      MEDIUM_EXTERNAL_STRING_TYPE = kMediumStringTag | v8.internal.StringRepresentationTag.kExternalStringTag,
      LONG_EXTERNAL_STRING_TYPE = kLongStringTag | v8.internal.StringRepresentationTag.kExternalStringTag,
      SHORT_EXTERNAL_ASCII_STRING_TYPE = kShortStringTag | kAsciiStringTag | v8.internal.StringRepresentationTag.kExternalStringTag,
      MEDIUM_EXTERNAL_ASCII_STRING_TYPE = kMediumStringTag | kAsciiStringTag | v8.internal.StringRepresentationTag.kExternalStringTag,
      LONG_EXTERNAL_ASCII_STRING_TYPE = kLongStringTag | kAsciiStringTag | v8.internal.StringRepresentationTag.kExternalStringTag,
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

    @unmanaged export class Object_ {
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

    function WRITE_FIELD(p: usize, offset: i32, value: usize): void {
      store<usize>(FIELD_ADDR(p, offset), value);
    }

    function WRITE_INT_FIELD(p: usize, offset: i32, value: i32): void {
      store<i32>(FIELD_ADDR(p, offset), value);
    }

    function READ_INT_FIELD(p: usize, offset: i32): i32 {
      return changetype<i32>(FIELD_ADDR(p, offset));
    }

    function READ_BYTE_FIELD(p: usize, offset: i32): u8 {
      return changetype<u8>(FIELD_ADDR(p, offset));
    }

    function WRITE_BYTE_FIELD(p: usize, offset: i32, value: u8): void {
      store<u8>(changetype<u8>(FIELD_ADDR(p, offset)), value);
    }

    @unmanaged export class HeapObject extends Object_ {
      static FromAddress(address: Address): HeapObject {
        return changetype<HeapObject>(address + kHeapObjectTag);
      }

      static cast(object: Object_): HeapObject {
        return changetype<HeapObject>(changetype<usize>(object));
      }

      static kMapOffset: i32 = v8.internal.Object_.kSize;
      static kSize: i32 = v8.internal.HeapObject.kMapOffset + kPointerSize;
    }

    @unmanaged export class Map extends HeapObject {
      static kInstanceAttributesOffset: usize = v8.internal.HeapObject.kSize;
      static kPrototypeOffset: usize = v8.internal.Map.kInstanceAttributesOffset + kIntSize;
      static kConstructorOffset: usize = v8.internal.Map.kPrototypeOffset + kPointerSize;
      static kInstanceDescriptorsOffset: usize = v8.internal.Map.kConstructorOffset + kPointerSize;
      static kCodeCacheOffset: usize = v8.internal.Map.kInstanceDescriptorsOffset + kPointerSize;
      static kSize: usize = v8.internal.Map.kCodeCacheOffset + kIntSize;

      static kInstanceSizeOffset: usize = v8.internal.Map.kInstanceAttributesOffset + 0;
      static kInstanceTypeOffset: usize = v8.internal.Map.kInstanceAttributesOffset + 1;
      static kUnusedPropertyFieldsOffset: usize = v8.internal.Map.kInstanceAttributesOffset + 2;
      static kBitFieldOffset: usize = v8.internal.Map.kInstanceAttributesOffset + 3;
    }

    @unmanaged export class MapWord {
      value_: usize = 0;

      constructor(value: usize) {
        this.value_ = value;
      }
    }


    @unmanaged export class Array extends HeapObject {
      static kLengthOffset: i32 = v8.internal.HeapObject.kSize;
      static kHeaderSize: i32 = v8.internal.Array.kLengthOffset + kIntSize;
    }

    @unmanaged export class FixedArray extends Array {
      static cast(object: Object_): FixedArray {
        return changetype<FixedArray>(changetype<usize>(object));
      }
    }

    @unmanaged export class Oddball extends HeapObject {
      static kToStringOffset: usize = v8.internal.HeapObject.kSize;
      static kToNumberOffset: usize = v8.internal.Oddball.kToStringOffset + kPointerSize;
      static kSize: usize = v8.internal.Oddball.kToNumberOffset + kPointerSize;
    }

    class Logger {
      static Setup(): bool {
        return false;
      }
    }

    class CPU {
      static Setup(): bool {
        return true;
      }
    }

    class Deserializer {
      GetLog(): void {

      }
    }

    export class Serializer {
      static serialization_enabled_: bool = true;

      static disable(): void {
        Serializer.serialization_enabled_ = false;
      }
    }

    let lowest_ever_allocated: Address = -1;
    let highest_ever_allocated: Address = 0;
    
    function UpdateAllocatedSpaceLimits(address: Address, size: i32): void {
      lowest_ever_allocated = min(lowest_ever_allocated, address);
      highest_ever_allocated = max(highest_ever_allocated, (address + size));
    }

    class OS {
      static Setup(): void { }

      static Allocate(requested: isize, allocated: usize, executable: bool = true): usize {
        const msize: isize = roundup(requested, <i32>GetPageSize());
        let mbase = heap.alloc(msize);

        if (mbase == 0) {
          //LOG(StringEvent("OS::Allocate", "VirtualAlloc failed"));
          return 0;
        }

        store<i32>(allocated, msize);
        UpdateAllocatedSpaceLimits(mbase, <i32>msize);
        return mbase;
      }

      static Free(buf: usize, length: isize): void {
        heap.free(buf);
      }
    }

    function GetPageSize(): isize {
      return 4096; // 32 bit
    }

    export class Snapshot {
      static size_: i32 = 0;
      static Initialize(snapshot_file: string = ""): bool {
        if (snapshot_file != "") {
          unreachable();
        } else if (this.size_ > 0) {
          unreachable();
        }
        return false;
      }
    }

    export class V8 {
      static has_been_setup_: bool = false;
      static has_been_disposed_: bool = false;

      static HasBeenSetup(): bool {
        return this.has_been_setup_;
      }

      static HasBeenDisposed(): bool {
        return this.has_been_disposed_;
      }

      static Initialize(des: Deserializer | null): bool {
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

      address(): Address {
        return changetype<Address>(this);
      }

      is_valid(): bool {
        return this.address() != NULL;
      }

      next_page(): usize /** Page* */{
        return MemoryAllocator.GetNextPage(changetype<usize>(this));
      }

      ObjectAreaStart(): Address {
        return this.address() + Page.kObjectStartOffset;
      }

      ObjectAreaEnd(): Address {
        return this.address() + Page.kPageSize;
      }

      RSetStart(): Address {
        return this.address() + Page.kRSetStartOffset;
      }

      ClearRSet(): void {
        let start: usize = this.RSetStart();
        let end: usize = start + (Page.kRSetEndOffset - Page.kRSetStartOffset);
        for (let i: usize = start; i < end; i++)
          store<usize>(i, 0);
      }

      static kPageSizeBits: i32 = 13;
      static kPageSize: i32 = 1 << v8.internal.Page.kPageSizeBits;
      static kPageAlignmentMask: i32 = (1 << v8.internal.Page.kPageSizeBits) - 1;
      static kRSetEndOffset: i32 = v8.internal.Page.kPageSize / kBitsPerPointer;
      static kRSetStartOffset: i32 = v8.internal.Page.kRSetEndOffset / kBitsPerPointer;
      static kObjectStartOffset: i32 = v8.internal.Page.kRSetEndOffset;
      static kObjectAreaSize: i32 = v8.internal.Page.kPageSize - v8.internal.Page.kObjectStartOffset;
      static kMaxHeapObjectSize: i32 = v8.internal.Page.kObjectAreaSize;

      static FromAddress(a: Address): usize {
        return changetype<usize>(a & ~Page.kPageAlignmentMask);
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
      static New(size: usize): usize {
        return Malloced.New(size);
      }
      
      static Delete(ptr: usize): void {
        Malloced.Delete(ptr);
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

    @unmanaged export class ChunkInfo {
      address_: Address = NULL;
      size_: isize = 0;
      owner_: usize = NULL; /** PagedSpace* */

      init(a: Address, s: isize, o: usize /**PagedSpace* */): void {
        this.address_ = a;
        this.size_ = s;
        this.owner_ = o;
      }

      address(): Address {
        return this.address_;
      }

      size(): isize {
        return this.size_;
      }

      owner(): usize /** PagedSpace* */ {
        return this.owner_;
      }
    }

    export class List<T> {
      [key: number]: T;
      data_: usize = 0;
      capacity_: i32 = 0;
      length_: i32 = 0;

      constructor(capacity: u32) {
        this.Initialize(capacity);
      }

      Initialize(capacity: u32): void {
        this.data_ = (capacity > 0) ? this.NewData(capacity) : 0
        this.capacity_ = capacity;
        this.length_ = 0;
      }

      NewData(n: u32): usize {
        return FreeStoreAllocationPolicy.New(n * sizeof<ChunkInfo>());
      }

      Add(element: T): void {
        if (this.length_ >= this.capacity_) {
          throw new Error("Unimplemented List<T>::Add");
          //unreachable();
        }
        return store<T>(this.data_ + (sizeof<T>() * this.length_++), element);
      }

      @operator("[]") __get(index: i32): T {
        return changetype<T>(this.data_ + (sizeof<T>() * index));
      }

      @operator("[]=") __set(index: i32, value: T): void {
        store<T>(this.data_ + (sizeof<T>() * index), value);
      }
    }

    @unmanaged export class VirtualMemory {
      address_: usize = 0;
      size_: isize = 0;

      constructor(size: isize) {
        this.address_ = heap.alloc(size);
        this.size_ = size;
      }

      IsReserved(): bool {
        return this.address_ != 0;
      }
      
      address(): usize {
        return this.address_;
      }

      Commit(address: usize, size: isize, executable: bool): bool {
        UpdateAllocatedSpaceLimits(address, <i32>size);
        return true;
      }
    }

    export class MemoryAllocator {
      static capacity_: i32 = 0;
      static max_nof_chunks_: i32 = 0;
      static size_: i32 = 0;
      static kMaxNofChunks: i32 = 1 << v8.internal.Page.kPageSizeBits;

      static kPagesPerChunk: i32 = 64;
      static kChunkSize: i32 = v8.internal.MemoryAllocator.kPagesPerChunk * v8.internal.Page.kPageSize;

      static kEstimatedNumberOfChunks: i32 = 1049; //270;

      static chunks_: v8.internal.List<v8.internal.ChunkInfo> = new v8.internal.List<v8.internal.ChunkInfo>(v8.internal.MemoryAllocator.kEstimatedNumberOfChunks);
      static free_chunk_ids_: v8.internal.List<i32> = new v8.internal.List<i32>(v8.internal.MemoryAllocator.kEstimatedNumberOfChunks);

      static top_: i32 = 0;

      static initial_chunk_: VirtualMemory = changetype<v8.internal.VirtualMemory>(0);

      static Pop(): i32 {
        return this.free_chunk_ids_[--this.top_];
      }

      static Setup(capacity: i32): bool {
        this.capacity_ = RoundUp(capacity, v8.internal.Page.kPageSize);
        this.max_nof_chunks_ = (this.capacity_ / (this.kChunkSize - v8.internal.Page.kPageSize) + 5);

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

      static ReserveInitialChunk(requested: isize): usize {
        this.initial_chunk_ = new VirtualMemory(requested);

        if (this.initial_chunk_ == null) return 0;

        if (this.initial_chunk_ != null && !this.initial_chunk_.IsReserved()) {
          //delete initial_chunk_;
          this.initial_chunk_ = changetype<VirtualMemory>(0);
          return NULL;
        }

        this.size_ += <i32>requested;
        if (this.initial_chunk_ != null)
          return this.initial_chunk_.address();
        return 0;
      }

      static CommitBlock(start: Address, size: isize, executable: bool): bool {
        if (!this.initial_chunk_.Commit(start, size, executable)) return false;
        // Counters.memory_allocated.Increment(size);
        return true;
      }

      static CommitPages(start: Address, size: isize, owner: usize /** PageSpace* */, num_pages: usize /**int* */): usize /** Page* */ {
        store<i32>(num_pages, PagesInChunk(start, size));
        if (!this.initial_chunk_.Commit(start, size, changetype<PagedSpace>(owner).executable())) {
          return changetype<usize>(Page.FromAddress(NULL));
        }
        //Counters::memory_allocated.Increment(size);
        let chunk_id: i32 = this.Pop();
        this.chunks_[chunk_id].init(start, size, owner);
        return this.InitializePagesInChunk(chunk_id, load<i32>(num_pages), owner);
      }

      static InitializePagesInChunk(chunk_id: i32, pages_in_chunk: i32, owner: usize /**PagedSpace* */): usize /** Page* */ {
        let chunk_start: Address = this.chunks_[chunk_id].address();
        let low: Address = roundup(chunk_start, Page.kPageSize);

        let page_addr: Address = low;
        for (let i: i32 = 0; i < pages_in_chunk; i++) {
          let p: Page = changetype<Page>(Page.FromAddress(page_addr));
          p.opaque_header = offsetfrom(page_addr + Page.kPageSize) | chunk_id;
          p.is_normal_page = 1;
          page_addr += Page.kPageSize;
        }

        let last_page: usize = Page.FromAddress(page_addr - Page.kPageSize);
        changetype<Page>(last_page).opaque_header = offsetfrom(0) | chunk_id;

        return Page.FromAddress(low);
      }

      static AllocatePages(requested_pages: i32, allocated_pages: usize /** int* */, owner: usize /**PagedSpace* */): usize /** Page* */ {
        if (requested_pages <= 0) return Page.FromAddress(NULL);
        let chunk_size: usize = heap.alloc(sizeof<isize>());
        store<isize>(chunk_size, requested_pages * Page.kPageSize);

        if (this.size_ + <i32>(chunk_size) > this.capacity_) {
          chunk_size = this.capacity_ - this.size_;
          requested_pages = <i32>(chunk_size >> Page.kPageSizeBits);
      
          if (requested_pages <= 0) return Page.FromAddress(NULL);
        }

        let chunk: usize = this.AllocateRawMemory(load<isize>(chunk_size), chunk_size, changetype<PagedSpace>(owner).executable());
        if (chunk == NULL) return Page.FromAddress(NULL);

        store<i32>(allocated_pages, PagesInChunk(changetype<Address>(chunk), chunk_size));
        if (load<i32>(allocated_pages) == 0) {
          this.FreeRawMemory(chunk, chunk_size);
          return Page.FromAddress(NULL);
        }

        let chunk_id: i32 = this.Pop();
        this.chunks_[chunk_id].init(changetype<Address>(chunk), chunk_size, owner);

        return this.InitializePagesInChunk(chunk_id, load<i32>(allocated_pages), owner);
      }

      static AllocateRawMemory(requested: isize, allocated: usize /** size_t* */, executable: bool): usize /** void* */ {
        if (this.size_ + changetype<i32>(requested) > this.capacity_) return NULL;

        let mem: usize = OS.Allocate(requested, allocated, executable);
        let alloced: i32 = load<i32>(allocated);
        this.size_ += alloced;
        //Counters::memory_allocated.Increment(alloced);
        return mem;
      } 

      static FreeRawMemory(mem: usize, length: isize): void {
        OS.Free(mem, length);
        //Counters::memory_allocated.Decrement(length);
        this.size_ -= <i32>length;
      }

      static GetNextPage(p: usize /** Page* */): usize /** Page* */{
        let raw_addr: i32 = changetype<Page>(p).opaque_header & ~Page.kPageAlignmentMask;
        return Page.FromAddress(<Address>raw_addr);
      }
    }

    @unmanaged export class AllocationStats {
      capacity_: i32 = 0;
      available_: i32 = 0;
      size_: i32 = 0;
      waste_: i32 = 0;

      constructor() {
        this.Clear();
      }

      Clear(): void {
        this.capacity_ = 0;
        this.available_ = 0;
        this.size_ = 0;
        this.waste_ = 0;
      }

      Reset(): void {
        this.available_ = this.capacity_;
        this.size_ = 0;
        this.waste_ = 0;
      }

      Capacity(): i32 {
        return this.capacity_;
      }

      ExpandSpace(size_in_bytes: i32): void {
        this.capacity_ += size_in_bytes;
        this.available_ += size_in_bytes;
      }
    }

    @unmanaged export class AllocationInfo {
      top: Address = 0;
      limit: Address = 0;
    }

    @unmanaged class Space {
      id_: AllocationSpace;
      executable_: bool;

      constructor(id: AllocationSpace, executable: bool) {
        this.id_ = id;
        this.executable_ = executable;
      }

      executable(): bool {
        return this.executable_;
      }

      identity(): AllocationSpace {
        return this.id_;
      }
    }

    @unmanaged class SemiSpace extends Space {
      capacity_: i32;
      maximum_capacity_: i32;
      start_: Address;
      age_mark_: Address;

      address_mask_: u32 = 0;
      object_mask_: u32 = 0;
      object_expected_: u32 = 0;

      constructor(initial_capacity: i32, maximum_capacity: i32, id: AllocationSpace, executable: bool) {
        super(id, executable);
        this.capacity_ = initial_capacity;
        this.maximum_capacity_ = maximum_capacity;
        this.start_ = NULL;
        this.age_mark_ = NULL;
      }

      Setup(start: Address, size: i32): bool {
        if (!MemoryAllocator.CommitBlock(start, this.capacity_, this.executable())) {
          return false;
        }
      
        this.start_ = start;
        this.address_mask_ = ~(size - 1);
        this.object_mask_ = this.address_mask_ | kHeapObjectTag;
        this.object_expected_ = <u32>start | kHeapObjectTag;
      
        this.age_mark_ = this.start_;
        return true;
      }

      low(): Address {
        return this.start_;
      }

      high(): Address {
        return this.low() + this.capacity_;
      }
    }

    function PagesInChunk(start: Address, size: isize): i32 {
      return <i32>(rounddown(start + size, Page.kPageSize) - roundup(start, Page.kPageSize)) >> Page.kPageSizeBits;
    }

    @unmanaged class PagedSpace extends Space {
      max_capacity_: i32;
      accounting_stats_: AllocationStats = new AllocationStats();
      first_page_: usize = 0; // Page
      allocation_info_: AllocationInfo = new AllocationInfo();
      mc_forwarding_info_: AllocationInfo = new AllocationInfo();

      constructor(max_capacity: i32, id: AllocationSpace, executable: bool) {
        super(id, executable);
        this.max_capacity_ = (rounddown(max_capacity, Page.kPageSize) / Page.kPageSize) * Page.kObjectAreaSize;
        this.accounting_stats_.Clear();

        this.allocation_info_.top = NULL;
        this.allocation_info_.limit = NULL;

        this.mc_forwarding_info_.top = NULL;
        this.mc_forwarding_info_.limit = NULL;
      }

      Setup(start: Address, size: isize): bool {
        console.log("PagedSpace::Setup", 924, true);
        if (this.HasBeenSetup()) return false;

        let num_pages: usize = heap.alloc(sizeof<i32>());
        store<i32>(num_pages, 0);
        
        if (PagesInChunk(start, size) > 0) {
          console.log("PagedSpace::Setup", 931, true);
          this.first_page_ = MemoryAllocator.CommitPages(start, size, changetype<usize>(this), num_pages);
        } else {
          console.log("PagedSpace::Setup", 934, true);
          let requested_pages: i32 = min(MemoryAllocator.kPagesPerChunk, this.max_capacity_ / Page.kObjectAreaSize);
          this.first_page_ = MemoryAllocator.AllocatePages(requested_pages, num_pages, changetype<usize>(this));
          console.log("934: requested_pages", requested_pages, changetype<Page>(this.first_page_).is_valid());
          if (!changetype<Page>(this.first_page_).is_valid()) return false;
        }
        
        this.accounting_stats_.ExpandSpace(<i32>(num_pages * Page.kObjectAreaSize));
        console.log("PagedSpace::Setup", 942, true);
        for (let p: Page = changetype<Page>(this.first_page_); p.is_valid(); p = changetype<Page>(p.next_page())) {
          p.ClearRSet();
        }
        console.log("PagedSpace::Setup", 946, true);
        this.SetAllocationInfo(changetype<usize>(this.allocation_info_), this.first_page_);
        return true;
      }

      SetAllocationInfo(alloc_info: usize /** AllocationInfo* */, p: usize /** Page* */): void {
        changetype<AllocationInfo>(alloc_info).top = changetype<Page>(p).ObjectAreaStart();
        changetype<AllocationInfo>(alloc_info).limit = changetype<Page>(p).ObjectAreaEnd();
      }

      HasBeenSetup(): bool {
        return (this.Capacity() > 0);
      }

      Capacity(): i32 {
        return this.accounting_stats_.Capacity();
      }
    }

    @unmanaged export class OldSpaceFreeList {
      owner_: AllocationSpace = 0;
      available_: i32 = 0;

      static kMinBlockSize: i32 = v8.internal.Array.kHeaderSize + kPointerSize;
      static kMaxBlockSize: i32 = v8.internal.Page.kMaxHeapObjectSize;
      static kFreeListsLength: i32 = v8.internal.OldSpaceFreeList.kMaxBlockSize / kPointerSize + 1;

      free_: array<OldSpaceFreeList.SizeNode> = new array<OldSpaceFreeList.SizeNode>(OldSpaceFreeList.kFreeListsLength);

      static kHead: i32 = v8.internal.OldSpaceFreeList.kMinBlockSize / kPointerSize - 1;
      static kEnd: i32 = kMaxInt;

      finger_: i32 = 0;

      needs_rebuild_: bool = false;

      constructor(owner: AllocationSpace) {
        this.owner_ = owner;
        this.Reset();
      }

      Reset(): void {
        this.available_ = 0;
        for (let i: i32 = 0; i < OldSpaceFreeList.kFreeListsLength; i++) {
          this.free_[i].head_node_ = NULL;
        }
        this.needs_rebuild_ = false;
        this.finger_ = OldSpaceFreeList.kHead;
        this.free_[OldSpaceFreeList.kHead].next_size_ = OldSpaceFreeList.kEnd;
      }
    }

    export namespace OldSpaceFreeList {
      @unmanaged export class SizeNode {
        head_node_: Address = NULL;
        next_size_: i32 = 0;
      }
    }

    @unmanaged class OldSpace extends PagedSpace {
      free_list_: OldSpaceFreeList;
      mc_end_of_relocation_: Address = NULL;

      constructor(max_capacity: i32, id: AllocationSpace, executable: bool) {
        super(max_capacity, id, executable);
        this.free_list_ = new OldSpaceFreeList(id);
      }
    }

    @unmanaged class NewSpace extends Space {
      capacity_: i32;
      maximum_capacity_: i32;

      to_space_: usize; // SemiSpace
      from_space_: usize; // SemiSpace

      start_: Address = NULL;
      address_mask_: u32 = 0;
      object_mask_: u32 = 0;
      object_expected_: u32 = 0;

      allocation_info_: AllocationInfo = new AllocationInfo();
      mc_forwarding_info_: AllocationInfo = new AllocationInfo();

      constructor(initial_semispace_capacity: i32, maximum_semispace_capacity: i32, id: AllocationSpace, executable: bool) {
        super(id, executable);
        this.maximum_capacity_ = maximum_semispace_capacity;
        this.capacity_ = initial_semispace_capacity;
        
        this.to_space_ = changetype<usize>(new SemiSpace(this.capacity_, this.maximum_capacity_, id, executable));
        this.from_space_ = changetype<usize>(new SemiSpace(this.capacity_, this.maximum_capacity_, id, executable));
      }

      Setup(start: Address, size: i32): bool {
        if (this.to_space_ == NULL || !(changetype<SemiSpace>(this.to_space_)).Setup(start, this.maximum_capacity_)) {
          return false;
        }

        if (this.from_space_ == NULL || !(changetype<SemiSpace>(this.from_space_)).Setup(start + this.maximum_capacity_, this.maximum_capacity_)) {
          return false;
        }

        this.start_ = start;
        this.address_mask_ = ~(size - 1);
        this.object_mask_ = this.address_mask_ | kHeapObjectTag;
        this.object_expected_ = <u32>start | kHeapObjectTag;

        this.allocation_info_.top = (changetype<SemiSpace>(this.to_space_)).low();
        this.allocation_info_.limit = (changetype<SemiSpace>(this.to_space_)).high();
        this.mc_forwarding_info_.top = NULL;
        this.mc_forwarding_info_.limit = NULL;

        return true;
      }
    }

    var heap_configured: bool = false;

    let FLAG_new_space_size: i32 = 0;
    let FLAG_old_space_size: i32 = 0;

    export class Heap {
      static semispace_size_: i32 = 1 * MB;
      static initial_semispace_size_: i32 = 256 * MB;
      static young_generation_size_: i32 = 0;
      static old_generation_size_: i32 = 512 * MB;

      static new_space_: usize = NULL; // NewSpace
      static old_space_: usize = NULL; // OldSpace
      static code_space_: usize = NULL; // CodeSpace
      static map_space_: usize = NULL; // MapSpace
      static lo_space_: usize = NULL; // LargeObjectSpace

      static HasBeenSetup(): bool {
        return this.new_space_ != NULL &&
          this.old_space_ != NULL &&
          this.code_space_ != NULL &&
          this.map_space_ != NULL &&
          this.lo_space_ != NULL;
      }

      static ConfigureHeap(semispace_size: i32, old_gen_size: i32): bool {
        if (this.HasBeenSetup()) return false;

        if (semispace_size > 0) this.semispace_size_ = semispace_size;
        if (old_gen_size > 0) this.old_generation_size_ = old_gen_size;

        this.semispace_size_ = RoundUpToPowerOf2(this.semispace_size_);
        this.initial_semispace_size_ = Min(this.initial_semispace_size_, this.semispace_size_);
        this.young_generation_size_ = 2 * this.semispace_size_;
        console.log("1094: old_generation_size_", this.old_generation_size_, true);
        this.old_generation_size_ = roundup(this.old_generation_size_, Page.kPageSize);
        console.log("1094: old_generation_size_", this.old_generation_size_, true);
        heap_configured = true;

        return true;
      }

      static ConfigureHeapDefault(): bool {
        return this.ConfigureHeap(FLAG_new_space_size, FLAG_old_space_size);
      }

      static MaxCapacity(): i32 {
        return this.young_generation_size_ + this.old_generation_size_;
      }

      static Setup(create_heap_objects: bool): bool {
        if (!heap_configured) {
          if (!this.ConfigureHeapDefault()) return false;
        }
        if (!MemoryAllocator.Setup(this.MaxCapacity())) return false;
        let chunk: usize = MemoryAllocator.ReserveInitialChunk(2 * this.young_generation_size_);
        if (chunk == NULL) return false;

        let old_space_start: Address = changetype<Address>(chunk);
        let new_space_start: Address = roundup(old_space_start, this.young_generation_size_);
        let code_space_start: Address = new_space_start + this.young_generation_size_;
        let old_space_size: i32 = <i32>(new_space_start - old_space_start);
        let code_space_size: i32 = this.young_generation_size_ - old_space_size;

        //console.log("1127: old_space_start");
        console.log("1127: old_generation_size_", this.old_generation_size_, true);

        this.new_space_ = changetype<usize>(new NewSpace(this.initial_semispace_size_, this.semispace_size_, AllocationSpace.NEW_SPACE, false));
        if (this.new_space_ == NULL) return false;
        if (!changetype<NewSpace>(this.new_space_).Setup(new_space_start, this.young_generation_size_)) return false;
        console.log("Heap::Setup", 1129, true);
        this.old_space_ = changetype<usize>(new OldSpace(this.old_generation_size_, AllocationSpace.OLD_SPACE, false));
        if (this.old_space_ == NULL) return false;
        if (!changetype<OldSpace>(this.old_space_).Setup(old_space_start, old_space_size)) return false;
        console.log("Heap::Setup", 1133, true);
        this.code_space_ = changetype<usize>(new OldSpace(this.old_generation_size_, AllocationSpace.CODE_SPACE, true));
        if (this.code_space_ == NULL) return false;
        if (!changetype<OldSpace>(this.code_space_).Setup(code_space_start, code_space_size)) return false;
        console.log("Heap::Setup", 1137, true);
        return true;
      }
    }
  } // namespace internal 

  //const i = internal;

  type FatalErrorCallback = null | ((location: string, message: string) => void);

  let has_shut_down: bool = false;
  let exception_behavior: FatalErrorCallback = null;

  export function API_Fatal(location: string, format: string): void {
    throw new Error(`\n#\n# Fatal error in ${ location }\n# ` + format + "\n#\n\n");
  }

  let DefaultFatalErrorHandler = (location: string, message: string): void => {
    v8.API_Fatal(location, message);
  }
  
  function GetFatalErrorHandler(): FatalErrorCallback {
    if (exception_behavior == null) {
      exception_behavior = DefaultFatalErrorHandler;
    }
    return exception_behavior;
  }

  function ApiCheck(condition: bool, location: string, message: string): bool {
    return condition ? true : Utils.ReportApiFailure(location, message);
  }

  function ReportV8Dead(location: string): bool {
    console.log("ReportV8Dead", 1170, true);
    let callback: FatalErrorCallback = GetFatalErrorHandler();
    if (callback != null)
      callback(location, "V8 is no longer useable");
    //console.log("error occured", 1173, false);
    console.log("ReportV8Dead - out", 1170, true);
    return true;
  }

  function IsDeadCheck(location: string): bool {
    return has_shut_down ? ReportV8Dead(location) : false;
  }

  function EnsureInitialized(location: string): void {
    console.log("EnsureInitialized", 1186, true);
    if (IsDeadCheck(location)) return;
    console.log("EnsureInitialized - out", 1186, true);
    ApiCheck(v8.V8.Initialize(), location, "Error initializing V8");
    console.log("EnsureInitialized - out2", 1188, true);
  }

  class Utils {
    static ReportApiFailure(location: string, message: string): bool {
      let callback: FatalErrorCallback = GetFatalErrorHandler();
      if (callback != null)
        callback(location, message);
      has_shut_down = true;
      return false;
    }
  }

  export class V8 {
    static Initialize(): bool {
      console.log("V8::Initialize", 1203, true);
      if (internal.V8.HasBeenSetup()) return true;
      let scope: HandleScope = new HandleScope();
      if (internal.Snapshot.Initialize()) {
        console.log("V8::Initialize", 1207, true);
        internal.Serializer.disable();
        return true;
      } else {
        console.log("V8::Initialize", 1211, true);
        return internal.V8.Initialize(null);
      }
    }
  }

  @unmanaged export class HandleScope {
    previous_: HandleScope.Data;
    is_closed_: bool;

    constructor() {
      this.previous_ = HandleScope.current_;
      this.is_closed_ = false;
      HandleScope.current_.extensions = 0;
    }
  }

  export namespace HandleScope {
    @unmanaged export class Data {
      extensions: i32 = 0;
      next: usize = 0;
      limit: usize = 0;

      Initialize(): void {
        this.extensions = -1;
        this.next = this.limit = 0;
      }
    }

    export var current_: HandleScope.Data = new v8.HandleScope.Data();
  }

  HandleScope.current_ = new HandleScope.Data();

  @unmanaged export class Handle<T> {
    val_: usize = 0;
    constructor(val: usize = 0) {
      this.val_ = val;
    }
  }

  @unmanaged export class Local<T> extends Handle<T> {
    constructor(that: usize = 0) {
      super(that);
    }
  }

  @unmanaged export class FunctionTemplate {
    constructor() {

    }
  }

  @unmanaged export class ObjectTemplate {
    static New(constructor: Handle<FunctionTemplate> = new Local<FunctionTemplate>()): Local<ObjectTemplate> {
      console.log("ObjectTemplate::New", 1258, true);
      if (IsDeadCheck("v8::ObjectTemplate::New()")) return new Local<ObjectTemplate>();
      EnsureInitialized("v8::ObjectTemplate::New()");
      console.log("ObjectTemplate::New - out", 1258, true);
      return new Local<ObjectTemplate>();
    }
  }

} // namespace v8

export function main(): usize {
  let handle_scope = new v8.HandleScope();
  let global = v8.ObjectTemplate.New();
  return changetype<usize>(global);
}