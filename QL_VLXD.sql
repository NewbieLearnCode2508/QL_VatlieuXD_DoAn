use master
go
create database QL_VLXD
go
use QL_VLXD
go
--***************************************************************************************************TẠO BẢNG
--*******************************************************************************Nhà cung cấp
create table NhaCungCap
(
	MaNhaCungCap varchar(10) not null,
	TenNhaCungCap nvarchar(50),
	DiaChi nvarchar(max),
	Email varchar(50),
	SoDienThoai varchar(10),
	LoaiSanPhamCungCap nvarchar(10),
	DonViTinhSanPhamCungCap nvarchar(10)
)
go
--***********************************************************************************Sản phẩm
create table SanPham
(
	MaSanPham varchar(10) not null,
	TenSanPham nvarchar(20),
	DonGia int,
	SoLuongTon int,
	MoTa nvarchar(max),
	HinhAnh varchar(max),
	MaNhaCungCap varchar(10) not null
)
go
--***********************************************************************************Nhân viên
create table NhanVien
(
	MaNhanVien varchar(10) not null,
	TenNhanVien nvarchar(50),
	DiaChi nvarchar(max),
	Email varchar(50),
	ChucVu nvarchar(20),
	SoDienThoai varchar(10),
	MatKhau varchar(20)
)
go
--**********************************************************************************Khách hàng
create table KhachHang
(
	MaKhachHang varchar(10) not null,
	TenKhachHang nvarchar(50),
	DiaChi nvarchar(max),
	Email varchar(50),
	SoDienThoai varchar(10),
	MatKhau varchar(20)
)
go
--**********************************************************************************Phiếu nhập
create table PhieuNhap
(
	MaPhieuNhap varchar(10) not null,
	NgayNhap date,
	TongTien int,
	MaNhanVien varchar(10) not null,
	MaNhaCungCap varchar(10) not null
)
go
--*************************************************************************Chi tiết phiếu nhập
create table ChiTietPhieuNhap
(
	MaPhieuNhap varchar(10) not null,
	MaSanPham varchar(10) not null,
	SoLuong int,
	DonGia int
)
go
--***********************************************************************************Đơn hàng
create table DonHang
(
	MaDonHang varchar(10) not null,
	NgayLap date,
	TongTien int,
	TrangThai nvarchar(100),
	MaNhanVien varchar(10) not null,
	MaKhachHang varchar(10) not null
)
go
--**************************************************************************Chi tiết đơn hàng
create table ChiTietDonHang
(
	MaDonHang varchar(10) not null,
	MaSanPham varchar(10) not null,
	SoLuong int,
	DonGia int
)

--**************************************************************************************************ĐẶT KHOÁ
--*******************************************************************************Nhà cung cấp
alter table NhaCungCap
add constraint PK_NhaCungCap primary key (MaNhaCungCap);

--***********************************************************************************Sản phẩm
alter table SanPham
add constraint PK_SanPham primary key (MaSanPham);

alter table SanPham
add constraint FK_SanPham_NhaCungCap foreign key (MaNhaCungCap) references NhaCungCap(MaNhaCungCap);

--***********************************************************************************Nhân viên
alter table NhanVien
add constraint PK_NhanVien primary key (MaNhanVien);

--**********************************************************************************Khách hàng
alter table KhachHang
add constraint PK_KhachHang primary key (MaKhachHang);

--**********************************************************************************Phiếu nhập
alter table PhieuNhap
add constraint PK_PhieuNhap primary key (MaPhieuNhap);

alter table PhieuNhap
add constraint FK_PhieuNhap_NhanVien foreign key (MaNhanVien) references NhanVien(MaNhanVien);

alter table PhieuNhap
add constraint FK_PhieuNhap_NhaCungCap foreign key (MaNhaCungCap) references NhaCungCap(MaNhaCungCap);

--*************************************************************************Chi tiết phiếu nhập
alter table ChiTietPhieuNhap
add constraint PK_ChiTietPhieuNhap primary key (MaPhieuNhap, MaSanPham);

alter table ChiTietPhieuNhap
add constraint FK_ChiTietPhieuNhap_PhieuNhap foreign key (MaPhieuNhap) references PhieuNhap(MaPhieuNhap);

alter table ChiTietPhieuNhap
add constraint FK_ChiTietPhieuNhap_SanPham foreign key (MaSanPham) references SanPham(MaSanPham);

--***********************************************************************************Đơn hàng
alter table DonHang
add constraint PK_DonHang primary key (MaDonHang);

alter table DonHang
add constraint FK_DonHang_NhanVien foreign key (MaNhanVien) references NhanVien(MaNhanVien);

alter table DonHang
add constraint FK_DonHang_KhachHang foreign key (MaKhachHang) references KhachHang(MaKhachHang);

--**************************************************************************Chi tiết đơn hàng
alter table ChiTietDonHang
add constraint PK_ChiTietDonHang primary key (MaDonHang, MaSanPham);

alter table ChiTietDonHang
add constraint FK_ChiTietDonHang_DonHang foreign key (MaDonHang) references DonHang(MaDonHang);

alter table ChiTietDonHang
add constraint FK_ChiTietDonHang_SanPham foreign key (MaSanPham) references SanPham(MaSanPham);

--**************************************************************************************************NHẬP DỮ LIỆU
--*******************************************************************************Nhà cung cấp
insert into NhaCungCap(MaNhaCungCap, TenNhaCungCap, DiaChi, Email,SoDienThoai, LoaiSanPhamCungCap, DonViTinhSanPhamCungCap) values
	('NCC001', N'Công ty vật liệu xây dựng An Phát', N'Phường Láng Thượng, Quận Đống đa, Hà Nội', 'anphat@gmail.com', '0987654321', N'Cát', 'm3'),
	('NCC002', N'Xí nghiệp khai thác đá Tân Cang', N'Phường Bửu Hòa, Thành phố Biên Hoà, Đồng Nai', 'tancang@gmail.com', '0977654321', N'Đá', 'm3'),
	('NCC003', N'Hoà Phát', N'Quận Bình Thạnh, TP. Hồ Chí Minh', 'hoaphat@gmail.com', '0967654321', N'Sắt', 'kg')

--***********************************************************************************Sản phẩm
insert into SanPham(MaSanPham, TenSanPham, DonGia, SoLuongTon, MoTa, HinhAnh, MaNhaCungCap) values
	('SP001', N'Cát vàng', 320000, 200, N'Loại hạt cát có màu vàng, có nhiều kích cỡ: nhỏ, trung bình, lớn phù hợp với nhiều mục đích khác nhau', 'https://th.bing.com/th/id/R.77d1f9dc799c6d664538624b9c9bbb4a?rik=aOHhR2hCOYAFwA&pid=ImgRaw&r=0', 'NCC001'),
	('SP002', N'Cát xây tô', 145000, 100, N'Còn được gọi là cát xây: đây là loại cát yêu cầu sạch, mịn, không lẫn tạp chất, được dùng để xây hoặc trát tường', 'https://static-4.happynest.vn/storage/uploads/2020/05/122ef9b4077fb73b69b0ce87b71a5cf5.jpg', 'NCC001'),
	('SP003', N'Đá 1x2', 300000, 100, N'Đá có kích thước 1x2 cm, thường dùng cho xây dựng', 'https://th.bing.com/th/id/R.b8f4be87ebc2bb0c75d16aec88ac96d9?rik=%2fpAJPsG3EbCqyw&pid=ImgRaw&r=0', 'NCC002'),
	('SP004', N'Đá 4x6', 350000, 400, N'Đá có kích thước 4x6 cm, thường dùng cho nền móng', 'https://static1.cafeland.vn/cafelandnew/hinh-anh/2020/09/28/95/image-20200928161323-2.jpeg', 'NCC002'),
	('SP005', N'Sắt tròn', 15000, 500, N'Sắt tròn thường được dùng trong xây dựng, có độ bền cao ', 'https://thepmoi.com/wp-content/uploads/2018/03/%E1%BB%91ng-th%C3%A9p-tr%C3%B2n.jpg', 'NCC003')

--***********************************************************************************Nhân viên
insert into NhanVien(MaNhanVien, TenNhanVien, DiaChi, Email, SoDienThoai, ChucVu, MatKhau) values
	('NV001', N'Trần Gia Bảo', N'Tiền Giang', 'baogia@gmail.com', '0935899678', 'Nhân viên', '123'),
	('NV002', N'Huỳnh Minh Khang', N'Bình Định', 'khanghuynh@gmail.com', '0935217776', 'Admin', '123'),
	('NV003', N'Trần Tiến Đạt', N'TP.HCM', 'dattran@gmail.com', '0935345678', 'Admin', '123')

--**********************************************************************************Khách hàng
insert into KhachHang(MaKhachHang, TenKhachHang, DiaChi, Email, SoDienThoai, MatKhau) values
	('KH001', N'Trịnh Phương Tuấn', N'Tây Ninh', 'Tuantrinh@gmail.com', '0935555678', '123')

--**********************************************************************************Phiếu nhập
insert into PhieuNhap(MaPhieuNhap, NgayNhap, TongTien, MaNhanVien, MaNhaCungCap) values
	('PN001', '2023-10-14', 2615000, 'NV001', 'NCC001'),
	('PN002', '2023-12-23', 3550000, 'NV001', 'NCC002'),
	('PN003', '2023-11-05', 480000, 'NV002', 'NCC003')

--*************************************************************************Chi tiết phiếu nhập
insert into ChiTietPhieuNhap(MaPhieuNhap, MaSanPham, SoLuong, DonGia) values
	('PN001', 'SP001', 5, 1600000),
	('PN001', 'SP002', 7, 1015000),
	('PN002', 'SP003', 6, 1800000),
	('PN002', 'SP004', 5, 1750000),
	('PN003', 'SP005', 32, 480000)

--***********************************************************************************Đơn hàng
insert into DonHang(MaDonHang, NgayLap, TongTien, TrangThai, MaNhanVien, MaKhachHang) values
	('DH001', '2024-06-19', 4048000,  N'Giao hàng thành công', 'NV002', 'KH001'),
	('DH002', '2024-08-07', 396750, N'Đang vận chuyển', 'NV001', 'KH001')

--**************************************************************************Chi tiết đơn hàng   
insert into ChiTietDonHang(MaDonHang, MaSanPham, SoLuong, DonGia) values
	('DH001', 'SP001', 3, 1104000),
	('DH001', 'SP002', 8, 1334000),
	('DH001', 'SP004', 4, 1610000),
	('DH002', 'SP005', 23, 396750)

