// ===================== COMMON DEFINE ==================== 
// Formatter VND
const formatter = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
})

// Auto Generate ID
async function generateCustomerCode() {
    try {
        // Lấy danh sách khách hàng từ API hoặc cơ sở dữ liệu
        const response = await fetch('http://localhost:3000/KH');
        if (!response.ok) {
            throw new Error(`Failed to fetch customers: ${response.statusText}`);
        }
        const customers = await response.json();

        // Lấy tất cả mã khách hàng từ danh sách
        const customerCodes = customers.map(customer => customer.MaKhachHang);

        // Tìm mã khách hàng lớn nhất hiện có
        let maxCode = 0;
        customerCodes.forEach(code => {
            const numberPart = parseInt(code.replace('KH', ''), 10); // Bỏ tiền tố "KH" và lấy số
            if (!isNaN(numberPart) && numberPart > maxCode) {
                maxCode = numberPart;
            }
        });

        // Sinh mã mới: tăng giá trị số lên 1 và thêm tiền tố "KH"
        const newCodeNumber = maxCode + 1;
        const newCustomerCode = `KH${newCodeNumber.toString().padStart(3, '0')}`; // Định dạng KH001, KH002...

        return newCustomerCode;
    } catch (error) {
        console.error('Error generating customer code:', error);
        return null; // Trả về null nếu xảy ra lỗi
    }
}

// ==================== DATABASE ==========================
let DATABASE = localStorage.getItem('DATABASE') ? JSON.parse(localStorage.getItem('DATABASE')) : {
    ACCOUNTS: [],
    ORDERS: []
};
// Get table to use
let PRODUCTS = [];
let ACCOUNTS = DATABASE.ACCOUNTS;
let ORDERS = [];

async function getProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();

        return products;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function addAccountKH(accountData) {
    try {
        // Gửi POST request lên server
        const response = await fetch('http://localhost:3000/KH', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Đảm bảo gửi dữ liệu dưới dạng JSON
            },
            body: JSON.stringify(accountData), // Chuyển dữ liệu thành JSON
        });

        // Kiểm tra xem request có thành công không
        if (!response.ok) {
            throw new Error(`Failed to add account: ${response.statusText}`);
        }

        // Đọc phản hồi từ server
        const result = await response.json();
        console.log('Account added successfully:', result);
        alert("Tạo Tài Khoản Thành Công !");
        window.location.reload()
        return result;
    } catch (error) {
        console.error('Error adding account:', error);
    }
}

async function getAccountKH() {
    try {
        const response = await fetch('http://localhost:3000/KH');
        if (!response.ok) {
            throw new Error('Failed to fetch khachhangs');
        }
        const khachhangs = await response.json();

        return khachhangs;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
//localStorage.setItem('DATABASE', JSON.stringify(DATABASE));

// ==================== SESSION STORE ==========================
let SESSION = sessionStorage.getItem('SESSION') ? JSON.parse(sessionStorage.getItem('SESSION')) : null;

// ========================================= CART CLIENT ===========================================
let btn_cart = document.getElementById('btn-cart');
let cart_overlay = document.getElementById('cart-overlay');
let close_cart = document.getElementById('close-cart');
let cart_tbody = document.getElementById('cart-tbody');
// let cart_quantity = document.getElementById('cart-quantity');

btn_cart.addEventListener('click', cartOverlayOn);
close_cart.addEventListener('click', cartOverlayOff);

function cartOverlayOn() {
    cart_overlay.style.display = 'block';
    renderCartItems();
}

function cartOverlayOff() {
    cart_overlay.style.display = 'none';
}

// Cart Render Items
function renderCartItems() {
    let checkout = document.getElementById('checkout');
    let total_inner = document.getElementById('total');
    let products = SESSION.products;
    let contents = '';
    let total = 0;

    if (products === undefined || products.length === 0) {
        total_inner.innerHTML = `<p class="text-center">Không có sản phẩm trong giỏ.</p>`;
        checkout.style.display = 'none';
    } else {
        checkout.style.display = 'block';
        products.forEach(p => {
            contents += `
            <tr>
                <td>
                    <img src="${p.HinhAnh}" alt="">
                </td>
                <td>
                    <p>${p.TenSanPham}</p>
                    <p>${formatter.format(p.DonGia)}</p>
                </td>
                <td>
                    ${p.quantity}
                </td>
                <td>
                    ${formatter.format(p.DonGia * p.quantity)}
                </td>
                <td>
                    
                </td>
            </tr>`;
            total += (p.DonGia * p.quantity);
        })
        total_inner.innerHTML = `Tổng Tiền: ${formatter.format(total)}`;
        cart_tbody.innerHTML = contents;
    }
}


// ========================================= FORM ACCOUNT CLIENT ===========================================
let regiseter_form = document.getElementById('regiseter-form');
let login_form = document.getElementById('login-form');
let login_form_area = document.getElementById('login-form-area');
let regiseter_form_area = document.getElementById('regiseter-form-area');

regiseter_form.addEventListener('click', showRegisterForm);
login_form.addEventListener('click', showSignForm);

function showRegisterForm() {
    login_form_area.style.display = 'none';
    regiseter_form_area.style.display = 'block';
}

function showSignForm() {
    login_form_area.style.display = 'block';
    regiseter_form_area.style.display = 'none';
}

// ********************** REGISTER ACCOUNT **********************
// Declare Form Input
let name = document.getElementById('name');
let number = document.getElementById('number');
let address = document.getElementById('address');
let email = document.getElementById('email');
let password = document.getElementById('password');
// let condition = document.getElementById('condition');

let register_btn = document.getElementById('register');
register_btn.addEventListener('click', addNewAccount);

function addNewAccount() {
    generateCustomerCode()
        .then(newCustomerCode => {
            let accountData = {
                MaKhachHang: newCustomerCode,
                TenKhachHang: name.value,
                DiaChi: address.value,
                Email: email.value,
                SoDienThoai: number.value,
                MatKhau: password.value,
            }
            if (validateFormRegister()) {
                addAccountKH(accountData)
            }
            register_btn.disabled = false;
        })
        .catch(error => {
            console.error('Lỗi khi tạo mã khách hàng:', error);
        });
}

function validateFormRegister() {
    let register_input = regiseter_form_area.querySelectorAll('input');
    let check = 0;

    register_input.forEach(input => {
        if (input.value === '') {
            input.style.border = "1px solid red";
            check++;
        } else {
            input.style.border = "1px solid #ced4da";
        }
    });

    if (check > 0) {
        register_btn.disabled = true;
        return false;
    } else {
        return true;
    }
}

// ********************** SIGNIN ACCOUNT **********************
let email_login = document.getElementById('email-login');
let password_login = document.getElementById('password-login');

let userAct = document.getElementById('userAct');
let userProfile = document.getElementById('userProfile');

let sign_btn = document.getElementById('signin');
sign_btn.addEventListener('click', actSignIn);

function actSignIn() {
    let valueOfAuthen = authenticate(email_login.value, password_login.value);
    if (valueOfAuthen !== null) {
        alert('Đăng Nhập Thành Công !');
        sessionStorage.setItem('SESSION', JSON.stringify(valueOfAuthen));
        $('#form_account').modal('hide');
        checkSession();
        location.reload();
    } else {
        alert('Đăng Nhập Thất Bại !');
    }
}

// Authenticate Account
function authenticate(email_login, password_login) {
    let userIDAndRole = null;
    console.log("ACCOUNTS", ACCOUNTS);

    ACCOUNTS.forEach(account => {
        if (account.Email === email_login && account.MatKhau === password_login) {
            userIDAndRole = {
                userID: account.MaKhachHang,
                role: "User"
            }
        }
    });
    return userIDAndRole;
}

window.onload = checkSession();

// Check Session Storage
function checkSession() {

    SESSION = JSON.parse(sessionStorage.getItem('SESSION'));
    console.log("Run Session Storage", SESSION);

    if (SESSION === null) {
        userAct.style.display = 'flex';
        userProfile.style.display = 'none';
    } else {
        if (SESSION.role === 'User') {
            userAct.style.display = 'none';
            userProfile.style.display = 'block';
        } else {
            userAct.style.display = 'none';
            userProfile.style.display = 'none';
        }
    }
}

// ========================================= PROFILE ACCOUNT CLIENT ===========================================
userProfile.addEventListener('click', actProfileToggle);

let logout = document.getElementById('logout');

logout.addEventListener('click', function () {
    sessionStorage.clear();
    location.reload();
})

function actProfileToggle() {
    SESSION = JSON.parse(sessionStorage.getItem('SESSION'));
    console.log("ACCOUNTS profile", ACCOUNTS);

    ACCOUNTS.forEach(function (account) {
        if (account.MaKhachHang === SESSION.userID) {
            renderProfileDetail(account);
        }
    })
}

function renderProfileDetail(account) {
    let p_name = document.getElementById('p_name');
    let p_number = document.getElementById('p_number');
    let p_email = document.getElementById('p_email');
    let p_address = document.getElementById('p_address');
    let p_nameTitle = document.getElementById('p_nameTitle');
    console.log(account);

    p_nameTitle.innerText = account.TenKhachHang;
    p_name.value = account.TenKhachHang;
    p_number.value = account.SoDienThoai;
    p_email.value = account.Email;
    p_address.value = account.DiaChi;

    // *** Update User Pr0fi|e ***
    let updateProfile = document.getElementById('updateProfile');
    updateProfile.addEventListener('click', updateUserProfile);

    async function updateUserProfile() {
        // Lấy thông tin từ form
        const p_name = document.getElementById("p_name");
        const p_number = document.getElementById("p_number");
        const p_email = document.getElementById("p_email");
        const p_address = document.getElementById("p_address");

        // Lấy thông tin userID từ sessionStorage (giả sử bạn đã lưu vào sessionStorage với key 'SESSION')
        let sessionData = JSON.parse(sessionStorage.getItem('SESSION'));
        let userID = sessionData ? sessionData.userID : null;

        if (!userID) {
            alert("Không tìm thấy thông tin khách hàng.");
            return;
        }

        // Tạo đối tượng chứa thông tin cần cập nhật
        let updatedData = {
            TenKhachHang: p_name.value,
            SoDienThoai: p_number.value,
            Email: p_email.value,
            DiaChi: p_address.value
        };

        try {
            // Gửi yêu cầu PUT tới server để cập nhật thông tin khách hàng
            const response = await fetch(`http://localhost:3000/KH/${userID}`, {
                method: 'PUT',  // Hoặc 'PATCH' tùy vào cách bạn định nghĩa API
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                // Cập nhật lại dữ liệu trong sessionStorage
                sessionData = { ...sessionData, ...updatedData };  // Cập nhật dữ liệu của khách hàng trong sessionStorage
                sessionStorage.setItem('SESSION', JSON.stringify(sessionData));

                alert('Cập nhật thông tin khách hàng thành công!');
                location.reload();
            } else {
                const errorData = await response.json();
                alert(`Lỗi: ${errorData.error || 'Cập nhật không thành công'}`);
            }
        } catch (error) {
            console.error('Error updating customer info:', error);
            alert('Đã xảy ra lỗi khi cập nhật thông tin.');
        }
    }
}

// Lấy mã khách hàng từ sessionStorage
const sessionData = JSON.parse(sessionStorage.getItem('SESSION'));
const customerId = sessionData ? sessionData.userID : null;
console.log(customerId);


if (customerId) {
    // Gửi yêu cầu đến API để lấy thông tin đơn hàng của khách hàng
    fetch('http://localhost:3000/DonHang')
        .then(response => response.json())
        .then(donHangs => {
            // Lọc đơn hàng của khách hàng hiện tại
            const customerOrders = donHangs.filter(order => order.MaKhachHang === customerId);

            // Sau khi lấy đơn hàng, gửi yêu cầu lấy chi tiết đơn hàng
            fetch('http://localhost:3000/ChiTietDonHang')
                .then(response => response.json())
                .then(chiTietDonHangs => {

                    // Render danh sách đơn hàng và chi tiết sản phẩm của từng đơn hàng
                    renderProfileOrder(customerOrders, chiTietDonHangs);
                })
                .catch(error => console.error('Error fetching ChiTietDonHang:', error));
        })
        .catch(error => console.error('Error fetching DonHang:', error));
} else {
    console.log('No customer ID found in sessionStorage');
}

async function renderProfileOrder(donHangs, chiTietDonHangs) {
    const profileTbody = document.getElementById('profileTbody');
    let content = '';
    const products = await getProducts();

    console.log("donHangs", donHangs);

    donHangs.forEach(order => {
        // Lấy chi tiết đơn hàng theo mã đơn hàng
        const orderDetails = chiTietDonHangs.filter(detail => detail.MaDonHang === order.MaDonHang);

        let productList = '';
        let totalPrice = 0;

        orderDetails.forEach(detail => {
            // Tìm tên sản phẩm theo mã sản phẩm
            const product = products.find(p => p.MaSanPham === detail.MaSanPham);

            if (product) {
                productList += `
                    Sản phẩm: ${product.TenSanPham} (Số lượng: ${detail.SoLuong})<br>
                `;
            } else {
                productList += `
                    Sản phẩm không tìm thấy (Mã sản phẩm: ${detail.MaSanPham})<br>
                `;
            }

            totalPrice += detail.SoLuong * detail.DonGia;
        });

        content += `
            <tr>
                <th scope="row" class="text-info">${order.MaDonHang}</th>
                <td>${new Date(order.NgayLap).toLocaleDateString()}</td>
                <td>${productList}</td>
                <td>${totalPrice.toLocaleString()} VND</td>
                <td class="text-center">Chưa xác nhận</td>
            </tr>
        `;
    });

    profileTbody.innerHTML = content;
}

// ********************** Show Profile *****************************
let s_profileInfo = document.getElementById('s_profileInfo');
let s_profileOrder = document.getElementById('s_profileOrder');

s_profileInfo.addEventListener('click', showProfileInfo);
s_profileOrder.addEventListener('click', showProfileOrder);

function showProfileInfo() {
    document.getElementById('account-info').style.display = 'block';
    document.getElementById('order-info').style.display = 'none';
    s_profileInfo.classList.add('liactive');
    s_profileOrder.classList.remove('liactive');
}

function showProfileOrder() {
    document.getElementById('account-info').style.display = 'none';
    document.getElementById('order-info').style.display = 'block';
    s_profileInfo.classList.remove('liactive');
    s_profileOrder.classList.add('liactive');
}

// ========================================= PRODUCT CLIENT ===========================================
let owl_slide = document.getElementById('owl-slide');
let extra_product = document.getElementById('extra-product');
let all_product = document.getElementById('all-product');

async function main() {
    const PRODUCTS = await getProducts();
    ACCOUNTS = await getAccountKH();
    loadProduct(PRODUCTS);
    bindAddCartEvents();
}

window.onload = main();

async function loadProduct(products) {
    if (!Array.isArray(products) || products.length === 0) {
        console.log('No products available to load.');
        return;
    }
    products.forEach(product => {
        renderAllProduct(product);
    });

    let owl = $('.owl-carousel');
    owl.owlCarousel({
        items: 4,
        loop: true,
        margin: 10,
        autoplay: true,
        autoplayTimeout: 1500,
        autoplayHoverPause: true
    });
}

function renderProduct(product) {
    let contents = `
        <div class="card" style="width: 18rem;" data-aos="fade-left">
            <img src="${product.HinhAnh}" class="card-img-top" alt="">
            <div class="card-body">
                <h5 class="card-title">${product.TenSanPham}</h5>
                <p class="card-text">${formatter.format(product.DonGia)}</p>
                <button class="btn btn-primary btn-sm" id="addCart" data-code="${product.MaSanPham}">Thêm Giỏ Hàng</button>
            </div>
        </div>`;
    owl_slide.innerHTML += contents;
}

function renderExtraProduct(product) {
    let contents = `
    <div class="card text-center col-3 mb-2" data-aos="zoom-in-down">
        <img src="${product.HinhAnh}" class="card-img-top" alt="">
        <div class="card-body">
            <h5 class="card-title">${product.TenSanPham}</h5>
            <p class="card-text">${formatter.format(product.DonGia)}</p>
            <button class="btn btn-primary btn-sm" id="addCart" data-code="${product.MaSanPham}">Thêm Giỏ Hàng</button>
        </div>
    </div>`;
    extra_product.innerHTML += contents;
}

function renderAllProduct(product) {
    let contents = `
        <div class="card col-3 text-center mb-2" data-aos="zoom-in-right">
            <img src="${product.HinhAnh}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${product.TenSanPham}</h5>
                <p class="card-text">${formatter.format(product.DonGia)}</p>
                <button class="btn btn-primary btn-sm" id="addCart" data-code="${product.MaSanPham}">Thêm Giỏ Hàng</button>
            </div>
        </div>
        `;
    all_product.innerHTML += contents;
}

// **********************  FILTER PRODUCT **********************
let filter_option = document.getElementById('filter-option');
filter_option.addEventListener('change', filterProduct);

async function filterProduct() {
    const PRODUCTS = await getProducts();

    let option = filter_option.value;
    if (option === 'priceUp') {
        PRODUCTS.sort(function (p1, p2) {
            return p1.DonGia - p2.DonGia;
        })
        all_product.innerHTML = '';
        PRODUCTS.forEach(product => renderAllProduct(product));
    }
    if (option === 'priceDown') {
        PRODUCTS.sort(function (p1, p2) {
            return p2.DonGia - p1.DonGia;
        })
        all_product.innerHTML = '';
        PRODUCTS.forEach(product => renderAllProduct(product));
    }
}

// ****************** Search ********************************
let search = document.getElementById("search");
search.addEventListener('input', actSearch);

async function actSearch() {
    const PRODUCTS = await getProducts();

    let searchInput = search.value;
    let productCompare = PRODUCTS.filter(product => searchCompare(searchInput, product.TenSanPham));
    all_product.innerHTML = '';
    productCompare.forEach(product => {
        renderAllProduct(product);
    });
}

// Search Compare
function searchCompare(searchInput, productName) {
    let searchInputLower = searchInput.toLowerCase();
    let productNameLower = productName.toLowerCase();
    return productNameLower.includes(searchInputLower);
}

// ========================================= CART CLIENT ===========================================
// ********************** ADD CART **********************
function bindAddCartEvents() {
    const addCarts = document.querySelectorAll('#addCart');
    addCarts.forEach(function (addCart) {
        addCart.addEventListener('click', addToCart);
    });
}

async function addToCart() {
    const PRODUCTS = await getProducts();
    let products = SESSION.products;
    let productCode = this.getAttribute('data-code');
    let productSaveCart;

    PRODUCTS.forEach(p => {
        if (p.MaSanPham === productCode) {
            productSaveCart = p;
        }
    })

    let { HinhAnh, TenSanPham, DonGia } = productSaveCart;

    let product = {
        MaSanPham: productCode,
        TenSanPham: TenSanPham,
        DonGia: DonGia,
        HinhAnh: HinhAnh,
        quantity: 1
    }

    if (products !== undefined) {
        let check = 0;
        products.forEach(p => {
            if (p.code === productCode) {
                p.quantity = p.quantity + 1;
                check++;
            }
        })

        if (check === 0) {
            products.push(product);
        }

    } else {
        SESSION.products = [];
        SESSION.products.push(product);
    }

    sessionStorage.setItem('SESSION', JSON.stringify(SESSION));
    alert('Thêm Sản Phẩm Vào Giỏ Hàng Thành Công !');

}

// ********************** CART DETAIL **********************
let checkout = document.getElementById('checkout');
let body_content = document.getElementById('body-content');
let body_cart = document.getElementById('body-cart');

let cart_table = document.getElementById('cart-table');

checkout.addEventListener('click', showCartDetail);

function showCartDetail() {
    cartOverlayOff();
    body_content.style.display = 'none';
    body_cart.style.display = 'block';
    renderCartDetail();
}

function renderCartDetail() {
    let products = SESSION.products;
    let contents = '';
    let total_price = 0;
    let total_quantity = 0;

    products.forEach(p => {
        contents += `
        <tr>
            <td>
                <img width="50" height="25" src="${p.HinhAnh}" alt="">
            </td>
            <td>${p.TenSanPham}</td>
            <td>${formatter.format(p.DonGia)}</td>
            <td>
                <i class="fas fa-minus-circle text-secondary" id="minus" data-code="${p.MaSanPham}"></i>
                <input type="text" value="${p.quantity}" min="1" style="width: 35px; padding-left: 8px;" disabled />
                <i class="fas fa-plus-circle text-success" id="plus" data-code="${p.MaSanPham}"></i>
            </td>
            <td>${formatter.format(p.DonGia * p.quantity)}</td>
            <td>
                <i class="fas fa-times text-danger" id="remove" data-code="${p.MaSanPham}"></i>
            </td>
        </tr> `;
        total_price += p.DonGia * p.quantity;
        total_quantity += p.quantity;
    });

    cart_table.innerHTML = contents;
    document.getElementById('payment-info').innerHTML = `
        <div class="col-6">
            <p>Tổng số lượng:</p>
            <p>Tổng giá:</p>
            <p>Giảm giá:</p>
            <p>Thành tiền:</p>
        </div>
        <div class="col-6">
            <p>${total_quantity}</p>
            <p>${formatter.format(total_price)}</p>
            <p>0 ₫</p>
            <p>${formatter.format(total_price)}</p>
        </div>
    `;
    loadUserInfo();
}

function loadUserInfo() {
    // Tìm thông tin khách hàng từ mảng ACCOUNTS
    const userAccount = ACCOUNTS.find(account => account.MaKhachHang === customerId);
    console.log("userAccount", userAccount);

    if (userAccount) {
        // Điền tự động thông tin vào các trường form
        document.getElementById('customer-name').value = userAccount.TenKhachHang;
        document.getElementById('customer-number').value = userAccount.SoDienThoai;
        document.getElementById('customer-address').value = userAccount.DiaChi;
        document.getElementById('customer-email').value = userAccount.Email;
    }
}
let customer_name = document.getElementById('customer-name');
let customer_number = document.getElementById('customer-number');
let customer_address = document.getElementById('customer-address');
let customer_email = document.getElementById('customer-email');
let customer_note = document.getElementById('customer-note');
let customer_check = document.getElementById('customer-check');

// ********************** CART ACTION **********************
cart_table.addEventListener('click', actCartProduct);

function actCartProduct(event) {
    let ev = event.target;
    let data_code = ev.getAttribute('data-code');

    if (ev.matches('#minus')) {
        let nValue = parseInt(ev.nextElementSibling.value) - 1;
        if (nValue <= 0) {
            nValue = 1;
            ev.nextElementSibling.value = nValue;
        } else {
            ev.nextElementSibling.value = nValue;
        }
        updateCartProduct(data_code, nValue);
    }

    if (ev.matches('#plus')) {
        let nValue = parseInt(ev.previousElementSibling.value) + 1;
        ev.previousElementSibling.value = nValue;
        updateCartProduct(data_code, nValue);
    }

    if (ev.matches('#remove')) {
        let products = SESSION.products;
        products = products.filter(product => product.MaSanPham !== data_code);
        SESSION.products = products;
        sessionStorage.setItem('SESSION', JSON.stringify(SESSION));
        renderCartDetail();
    }
}

function updateCartProduct(code, nQuantity) {
    let products = SESSION.products;

    products.forEach(p => {
        if (p.MaSanPham === code) {
            p.quantity = nQuantity;
        }
    })

    sessionStorage.setItem('SESSION', JSON.stringify(SESSION));
    renderCartDetail();
}

// ********************** Random product for left bar **********************
async function loadRandomProducts() {
    try {
        const response = await fetch('http://localhost:3000/random-products');
        if (!response.ok) {
            throw new Error('Failed to fetch random products');
        }

        const products = await response.json();
        const container = document.getElementById('random-products');

        // Xoá nội dung cũ nếu có
        container.innerHTML = '';

        products.forEach(product => {
            const productHtml = `
                <div class="one-product">
                    <img width="80" height="50" src="${product.HinhAnh}" alt="${product.TenSanPham}">
                    <div class="ml-2">
                        <p>${product.TenSanPham}</p>
                        <p>${formatter.format(product.DonGia)}</p>
                    </div>
                </div>
                <hr>
            `;
            container.innerHTML += productHtml;
        });
    } catch (error) {
        console.error('Error loading random products:', error);
    }
}

// Gọi hàm khi trang tải
document.addEventListener('DOMContentLoaded', loadRandomProducts);

// ********************** ORDER ACTION **********************
let order_btn = document.getElementById('order');

order_btn.addEventListener('click', handleOrderAction);

function handleOrderAction() {

    // Lấy thông tin từ form
    const name = document.getElementById('customer-name').value;
    const phoneNumber = document.getElementById('customer-number').value;
    const address = document.getElementById('customer-address').value;
    const email = document.getElementById('customer-email').value;
    const note = document.getElementById('customer-note').value;
    const isHomeDelivery = document.getElementById('customer-check').checked;

    // Lưu thông tin giao hàng vào session storage hoặc gửi vào cơ sở dữ liệu nếu cần
    const orderInfo = {
        name,
        phoneNumber,
        address,
        email,
        note,
        isHomeDelivery
    };

    // Lưu vào session storage nếu cần
    sessionStorage.setItem('orderInfo', JSON.stringify(orderInfo));

    // Gọi hàm để lưu đơn hàng và chi tiết đơn hàng
    actOrder();
}

async function actOrder() {
    // Lấy thông tin giỏ hàng từ session storage
    const sessionData = JSON.parse(sessionStorage.getItem('SESSION'));
    const userID = sessionData.userID;
    const products = sessionData.products;

    // Tạo mã đơn hàng mới (ví dụ: tự động sinh mã hoặc lấy từ hệ thống)
    const orderID = generateOrderID(); // Hàm sinh mã đơn hàng

    // Tính tổng tiền đơn hàng
    let totalPrice = 0;
    products.forEach(product => {
        totalPrice += product.quantity * product.DonGia;
    });

    // Lấy thông tin nhân viên
    const employeeID = 'NV001';

    // Tạo đối tượng đơn hàng
    const orderData = {
        MaDonHang: orderID,
        NgayLap: new Date().toISOString(),
        TongTien: totalPrice,
        MaNhanVien: employeeID,
        MaKhachHang: userID
    };

    // Gửi yêu cầu POST đến API để thêm đơn hàng vào bảng DonHang
    try {
        await fetch('http://localhost:3000/DonHang', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        // Lưu chi tiết đơn hàng vào bảng ChiTietDonHang
        for (const product of products) {
            const orderDetailData = {
                MaDonHang: orderID,
                MaSanPham: product.MaSanPham,
                SoLuong: product.quantity,
                DonGia: product.DonGia
            };

            // Gửi yêu cầu POST để thêm chi tiết đơn hàng vào bảng ChiTietDonHang
            await fetch('http://localhost:3000/ChiTietDonHang', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderDetailData)
            });
        }
        // Sau khi đặt hàng thành công, xóa giỏ hàng khỏi SESSION
        let sessionData = JSON.parse(sessionStorage.getItem('SESSION'));
        sessionData.products = [];

        // Cập nhật lại SESSION
        sessionStorage.setItem('SESSION', JSON.stringify(sessionData));

        // Reload lại trang để cập nhật lại giao diện
        location.reload();

        alert('Đặt hàng thành công!');
        // Có thể chuyển hướng hoặc làm gì đó sau khi đặt hàng thành công

    } catch (error) {
        console.error('Có lỗi xảy ra khi đặt hàng:', error);
        alert('Đặt hàng thất bại, vui lòng thử lại!');
    }
}

// Hàm sinh mã đơn hàng (có thể tự động sinh hoặc lấy từ hệ thống)
function generateOrderID() {
    const prefix = 'DH';
    const randomID = Math.random().toString(36).substring(2, 7).toUpperCase();
    return prefix + randomID;
}

function validateForm() {
    let customer_form = document.getElementById('customer-form');
    let customer_input = customer_form.querySelectorAll('input');
    let check = 0;
    customer_input.forEach(input => {
        if (input.value === '') {
            input.style.border = "1px solid red";
            check++;
        } else {
            input.style.border = "1px solid #ced4da";
        }
    })

    // Stupid again :))
    if (check > 0) {
        order_btn.disabled = true;
        return false;
    } else {
        return true;
    }
}

// Lấy đối tượng nút "Đi lên đầu trang"
const backToTopBtn = document.getElementById("backToTopBtn");

// Khi người dùng cuộn trang, hiển thị hoặc ẩn nút
window.onscroll = function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
};

// Hàm cuộn lên đầu trang
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Cuộn mượt
    });
}