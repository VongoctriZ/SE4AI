### Giới thiệu project:
- Tên project: DeepFashion
- Project tạo một trang web thời trang với các usecase cơ bản
- Có sử dụng mô hình recommendation để đề xuất sản phẩm phù hợp với người dùng
- Host trên máy local, chưa deploy public với tên miền

---

### Hướng dẫn sử dụng chương trình:
- Môi trường sử dụng: VS Code
- Cách dùng: clone master branch về để chạy code trên VSCode
- Truy cập đến từng thư mục với một terminal riêng, install các package cần thiết, sau đó chạy code bằng các dòng lệnh như sau

|folder|command|
|-|-|
| .\admin\ | `npm run dev` |
| .\backend\ | `npm start` |
| .\frontend\ | `npm start` |
| .\AI\ | `python main.py` |
|||

### Package requirement for each folder:

|folder|requirement package|
|-|-|
| .\admin\ | `npm install vite` |
| .\backend\ | `npm install` |
| .\frontend\ | `npm install` |
| .\AI\ | `pip install pymongo implicit schedule surprise` |
|||
