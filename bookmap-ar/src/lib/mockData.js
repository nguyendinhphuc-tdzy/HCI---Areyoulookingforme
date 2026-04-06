// Mock physical locations for Nguyen Van Binh book street
export const BOOTHS = [
  { id: 'B1', name: 'Nha Nam Books', lat: 10.780164, lng: 106.699479, description: 'Popular fiction and literature' },
  { id: 'B2', name: 'First News', lat: 10.780231, lng: 106.699564, description: 'Self-help and business books' },
  { id: 'B3', name: 'Tre Publishing', lat: 10.780092, lng: 106.699395, description: 'Youth literature and comics' },
  { id: 'B4', name: 'Phuong Nam', lat: 10.780289, lng: 106.699651, description: 'Stationery and general books' },
  { id: 'B5', name: 'Kim Dong', lat: 10.780188, lng: 106.699522, description: 'Children books and mangas' }
]

export const KIOSK_LOCATION = { lat: 10.780000, lng: 106.699300 } // Fixed coords simulating scanning at Kiosk

export const BOOKS = [
  { id: 'L1', title: 'The Little Prince', author: 'Antoine de Saint-Exupéry', booth_id: 'B1' },
  { id: 'L2', title: 'Doraemon', author: 'Fujiko F. Fujio', booth_id: 'B5' },
  { id: 'L3', title: 'Cho toi xin mot ve di tuoi tho', author: 'Nguyen Nhat Anh', booth_id: 'B3' }
]
