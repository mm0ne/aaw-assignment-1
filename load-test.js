import http from "k6/http";
import { check, sleep } from "k6";
import { randomString } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

// Fungsi untuk menghitung interarrival time berdasarkan distribusi Poisson
// function poissonInterarrival(lambda) {
//     return -Math.log(Math.random()) / lambda;
// }

export let options = {
    scenarios: {
        limited_sale: {
            executor: "ramping-arrival-rate",
            startRate: 20,  // Mulai dari 5 request per detik
            timeUnit: "1s",
            preAllocatedVUs: 100, // Awalnya ada 100 VUs siap
            maxVUs: 500, // Maksimum 1000 VUs
            stages: [
                { duration: "60s", target: 20 }, // Awalnya average load
                { duration: "60s", target: 80 }, // Tiba-tiba flash sale
                { duration: "60s", target: 40 }, // Recovery phase
                { duration: "60s", target: 10 }, // low load
            ],
        },
    },
};

// Endpoints
const AUTH_ENDPOINT = "http://localhost:10000/api/auth";
const PRODUCT_ENDPOINT = "http://localhost:10002/api/product";
const CART_ENDPOINT = "http://localhost:10003/api/cart";
const ORDER_ENDPOINT = "http://localhost:10003/api/order";

const couriers = ["JNE", "TIKI", "SICEPAT", "GOSEND", "GRAB_EXPRESS"];

const jsonHeader = {
    headers: { "Content-Type": "application/json" },
};

// Fungsi utama setiap VU
export default function () {
    // Set lambda berdasarkan jumlah VU yang berjalan
    let lambda = __VU / 10; // Semakin banyak VU, semakin tinggi rate (sesuaikan)

    while (true) {
        let registerBody = {
            username: `user_${randomString(8)}`,
            email: `user_${randomString(8)}@ui.ac.id`,
            password: `Userpw_t0bt0bitob`,
            full_name: "Test User",
            address: "123 Test St",
            phone_number: "555-1234",
        };
        let registerRes = http.post(
            AUTH_ENDPOINT + "/register",
            JSON.stringify(registerBody),
            {
                tags: "Auth",
                ...jsonHeader
            }
        );
        check(registerRes, { "Register User status 201": (r) => r.status === 201 });

        let loginBody = JSON.stringify({
            username: registerBody.username,
            password: registerBody.password,
        });

        let loginRes = http.post(AUTH_ENDPOINT + "/login", loginBody, {
            tags: "Auth",
            ...jsonHeader
        });
        check(loginRes, { "login status 200": (r) => r.status === 200 });

        let token = loginRes.json("token");
        let dynamicAuthHeader = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        let getAllProductRes = http.get(PRODUCT_ENDPOINT + "/", {
            tags: "Product"
        });
        check(getAllProductRes, { "product status 200": (r) => r.status === 200 });

        let products = getAllProductRes.json("products");
        products = products.slice(1);

        let productId = products[Math.floor(Math.random() * products.length)].id;
        let addItemToCart = JSON.stringify({
            product_id: productId,
            quantity: 1,
        });

        let cartRes = http.post(CART_ENDPOINT, addItemToCart, {
            tags: "Cart",
            ...dynamicAuthHeader
        });
        check(cartRes, { "cart status 201": (r) => r.status === 201 });

        const orderBody = JSON.stringify({
            shipping_provider: couriers[Math.floor(Math.random() * couriers.length)],
        });

        let orderRes = http.post(ORDER_ENDPOINT, orderBody, {
            tags: "Order",
            ...dynamicAuthHeader
        });
        check(orderRes, { "place order status 201": (r) => r.status === 201 });

        let orderId = orderRes.json("order").id;

        let orderDetailRes = http.get(
            ORDER_ENDPOINT + `/${orderId}`,
            {
                tags: "Order",
                ...dynamicAuthHeader
            }
        );
        check(orderDetailRes, { "order detail status 200": (r) => r.status === 200 });

        if (Math.random() > 0.5) {
            let totalAmount =
                orderDetailRes.json("quantity") * orderDetailRes.json("unit_price");

            let payBody = JSON.stringify({
                payment_method: "eth",
                payment_reference: `eth${randomString(16)}`,
                amount: totalAmount,
            });
            let payOrderRes = http.post(
                ORDER_ENDPOINT + `/${orderId}/pay`,
                payBody,
                {
                    tags: "Order",
                    ...dynamicAuthHeader
                }
            );
            check(payOrderRes, { "pay order status 200": (r) => r.status === 200 });
        } else {
            let deleteOrderRes = http.post(
                ORDER_ENDPOINT + `/${orderId}/cancel`,
                null,
                {
                    tags: "Order",
                    ...dynamicAuthHeader
                }
            );
            check(deleteOrderRes, {
                "delete order status 200": (r) => r.status === 200,
            });
        }

        // Useless bro, setiap request itu beda user
        // sleep(poissonInterarrival(lambda));
    }
}
