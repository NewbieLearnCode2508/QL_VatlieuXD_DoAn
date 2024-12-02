const express = require('express');
const sql = require('mssql');
const cors = require('cors');  // Import thư viện cors
const app = express();
const port = 3000;

// Middleware để xử lý dữ liệu JSON
app.use(express.json());

// Cấu hình kết nối SQL Server
const config = {
    user: 'sa',
    password: '123456',  // Thay bằng mật khẩu của bạn
    server: 'HADIRGO',    // Địa chỉ của SQL Server
    database: 'QL_VLXD',  // Tên cơ sở dữ liệu của bạn
    options: {
        encrypt: false,       // Bật mã hóa nếu cần
        trustServerCertificate: true  // Bỏ qua kiểm tra chứng chỉ SSL
    }
};

// Cấu hình CORS để cho phép yêu cầu từ trang web của bạn
app.use(cors({
    origin: 'http://127.0.0.1:5500'  // Thay bằng URL của front-end của bạn
}));

// Tạo pool kết nối
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

// Route để lấy danh sách sản phẩm
app.get('/products', async (req, res) => {
    try {
        // Kết nối đến SQL Server
        await sql.connect(config);

        // Truy vấn bảng SanPham
        const result = await sql.query('SELECT * FROM SanPham');

        // Trả về dữ liệu dưới dạng JSON
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error:', err);
        res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
    }
});

app.get('/NCC', async (req, res) => {
    try {
        // Kết nối đến SQL Server
        await sql.connect(config);

        // Truy vấn bảng SanPham
        const result = await sql.query('SELECT * FROM NhaCungCap');

        // Trả về dữ liệu dưới dạng JSON
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error:', err);
        res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
    }
});

app.get('/NhanVien', async (req, res) => {
    try {
        // Kết nối đến SQL Server
        await sql.connect(config);

        // Truy vấn bảng SanPham
        const result = await sql.query('SELECT * FROM NhanVien');

        // Trả về dữ liệu dưới dạng JSON
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error:', err);
        res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
    }
});

app.get('/KH', async (req, res) => {
    try {
        // Kết nối đến SQL Server
        await sql.connect(config);

        // Truy vấn bảng SanPham
        const result = await sql.query('SELECT * FROM KhachHang');

        // Trả về dữ liệu dưới dạng JSON
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error:', err);
        res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
    }
});

app.get('/DonHang', async (req, res) => {
    try {
        // Kết nối đến SQL Server
        await sql.connect(config);

        // Truy vấn bảng SanPham
        const result = await sql.query('SELECT * FROM DonHang');

        // Trả về dữ liệu dưới dạng JSON
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error:', err);
        res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
    }
});

app.get('/ChiTietDonHang', async (req, res) => {
    try {
        // Kết nối đến SQL Server
        await sql.connect(config);

        // Truy vấn bảng SanPham
        const result = await sql.query('SELECT * FROM ChiTietDonHang');

        // Trả về dữ liệu dưới dạng JSON
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error:', err);
        res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
    }
});

app.get('/ChiTietPhieuNhap', async (req, res) => {
    try {
        // Kết nối đến SQL Server
        await sql.connect(config);

        // Truy vấn bảng SanPham
        const result = await sql.query('SELECT * FROM ChiTietPhieuNhap');

        // Trả về dữ liệu dưới dạng JSON
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error:', err);
        res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
    }
});

// Route POST /KH để thêm khách hàng mới
app.post('/KH', async (req, res) => {
    const { MaKhachHang, TenKhachHang, DiaChi, Email, SoDienThoai, MatKhau } = req.body;

    // Kiểm tra dữ liệu hợp lệ
    if (!MaKhachHang || !TenKhachHang || !DiaChi || !Email || !SoDienThoai || !MatKhau) {
        return res.status(400).json({ error: 'Invalid customer data' });
    }

    try {
        // Kiểm tra trùng mã khách hàng
        const result = await sql.query`SELECT * FROM KhachHang WHERE MaKhachHang = ${MaKhachHang}`;
        if (result.recordset.length > 0) {
            return res.status(409).json({ error: 'Customer code already exists' });
        }

        // Thêm khách hàng vào cơ sở dữ liệu
        const query = `
            INSERT INTO KhachHang (MaKhachHang, TenKhachHang, DiaChi, Email, SoDienThoai, MatKhau)
            VALUES ('${MaKhachHang}', N'${TenKhachHang}', N'${DiaChi}', '${Email}', '${SoDienThoai}', '${MatKhau}')
        `;

        await sql.query(query);
        res.status(201).json({ message: 'Customer added successfully', customer: req.body });
    } catch (error) {
        console.error('Error adding customer:', error);
        res.status(500).json({ error: 'Failed to add customer' });
    }
});

app.get('/random-products', async (req, res) => {
    try {
        // Đảm bảo sử dụng kết nối pool
        await poolConnect;  // Đảm bảo pool kết nối đã sẵn sàng
        const request = pool.request();  // Sử dụng request từ pool
        const result = await request.query('SELECT TOP 7 * FROM SanPham ORDER BY NEWID()');  // Truy vấn ngẫu nhiên 7 sản phẩm

        // Trả kết quả dưới dạng JSON
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching random products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.get('/PhieuNhap', async (req, res) => {
    try {
        // Kết nối đến SQL Server
        await sql.connect(config);

        // Truy vấn bảng SanPham
        const result = await sql.query('SELECT * FROM PhieuNhap');

        // Trả về dữ liệu dưới dạng JSON
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error:', err);
        res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
    }
});

app.put('/KH/:userID', async (req, res) => {
    const { userID } = req.params;
    const { TenKhachHang, SoDienThoai, Email, DiaChi } = req.body;

    if (!TenKhachHang || !SoDienThoai || !Email || !DiaChi) {
        return res.status(400).json({ error: 'Missing data to update' });
    }

    try {
        const query = `
            UPDATE KhachHang 
            SET 
                TenKhachHang = @TenKhachHang,
                SoDienThoai = @SoDienThoai,
                Email = @Email,
                DiaChi = @DiaChi
            WHERE MaKhachHang = @userID
        `;
        const request = pool.request();
        request.input('TenKhachHang', sql.NVarChar, TenKhachHang);
        request.input('SoDienThoai', sql.NVarChar, SoDienThoai);
        request.input('Email', sql.NVarChar, Email);
        request.input('DiaChi', sql.NVarChar, DiaChi);
        request.input('userID', sql.NVarChar, userID);

        await request.query(query);
        res.status(200).json({ message: 'Customer info updated successfully' });
    } catch (error) {
        console.error('Error updating customer in DB:', error);
        res.status(500).json({ error: 'Failed to update customer' });
    }
});

app.get('/DonHang', async (req, res) => {
    const { MaKhachHang } = req.query;

    if (!MaKhachHang) {
        return res.status(400).json({ error: 'MaKhachHang is required' });
    }

    try {
        // Truy vấn đơn hàng của khách hàng theo MaKhachHang
        const query = `
            SELECT * FROM DonHang WHERE MaKhachHang = @MaKhachHang;
        `;
        const request = pool.request();
        request.input('MaKhachHang', sql.NVarChar, MaKhachHang);

        const result = await request.query(query);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

app.post('/DonHang', async (req, res) => {
    const { MaDonHang, NgayLap, TongTien, MaNhanVien, MaKhachHang } = req.body;

    try {
        const query = `
            INSERT INTO DonHang (MaDonHang, NgayLap, TongTien, MaNhanVien, MaKhachHang)
            VALUES ('${MaDonHang}', '${NgayLap}', ${TongTien}, '${MaNhanVien}', '${MaKhachHang}')
        `;
        await sql.query(query);
        res.status(201).json({ message: 'Order created successfully' });
    } catch (err) {
        console.error('Error inserting order:', err);
        res.status(500).json({ error: 'Error inserting order' });
    }
});

app.post('/ChiTietDonHang', async (req, res) => {
    const { MaDonHang, MaSanPham, SoLuong, DonGia } = req.body;

    try {
        const query = `
            INSERT INTO ChiTietDonHang (MaDonHang, MaSanPham, SoLuong, DonGia)
            VALUES ('${MaDonHang}', '${MaSanPham}', ${SoLuong}, ${DonGia})
        `;
        await sql.query(query);
        res.status(201).json({ message: 'Order detail added successfully' });
    } catch (err) {
        console.error('Error inserting order detail:', err);
        res.status(500).json({ error: 'Error inserting order detail' });
    }
});

// Chạy server trên port 3000
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
