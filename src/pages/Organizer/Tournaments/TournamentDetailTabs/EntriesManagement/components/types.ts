// Định nghĩa mở rộng cho Frontend dựa trên Backend type
export interface EntryMember {
  id: number;
  entryId: number;
  userId: number;
  eloAtEntry: number;
  avatarUrl?: string; // Bổ sung cho UI
}

export interface Entry {
  id: number;
  entryIdString: string; // VD: #ENT-0942
  name: string; // Tên team hoặc tên VĐV (nếu đánh đơn)
  avatarUrl?: string;
  categoryId: number;
  categoryName: string; // Tên hạng mục (Pro Men's Open...)
  captainId: number;
  isAcceptingMembers: boolean;
  requiredMemberCount: number;
  currentMemberCount: number;
  lineupStatus: "CONFIRMED" | "PENDING";
  paymentStatus: "PAID" | "UNPAID";
  members: EntryMember[];
  createdAt: string;
  updatedAt: string;
}