# Realtime Task Collaboration System

Hệ thống quản lý công việc theo thời gian thực cho nhóm nhỏ, tương tự Trello (phiên bản rút gọn). Cho phép nhiều người thao tác đồng thời trên cùng workspace và đồng bộ dữ liệu ngay lập tức.

## 1. Tổng quan

Hệ thống hỗ trợ:

- Đăng ký / đăng nhập bằng JWT
- Tạo workspace và mời thành viên
- CRUD task
- Cập nhật trạng thái task realtime
- Đồng bộ UI giữa nhiều người dùng mà không cần reload

## 2. Kiến trúc hệ thống

Hệ thống được tách thành 2 phần rõ ràng:
| Backend (NestJS) | Frontend (Next.js) |
|------------------|---------------------------------|
|REST API (CRUD) | API layer (useApi)|
|WebSocket Gateway (Socket.IO)| Socket layer (useSocket)|
|JWT Authentication|State management (React state / custom hooks)|
|PostgreSQL (TypeORM / Prisma)||

## 3. Database Design

| User        |
| ----------- |
| id          |
| email       |
| nameDisplay |
| password    |
| status      |
| createAt    |
| updateAt    |

| RefreshToken |
| ------------ |
| id           |
| token        |
| expiredAt    |
| revokeAt     |
| createAt     |

Quan hệ: 1 User - N RefreshToken

| Workspace     |
| ------------- |
| id            |
| workspaceName |
| description   |
| ownerId       |
| createAt      |
| updateAt      |

1 User (owner) - N Workspace

| WorkspaceMember |
| --------------- |
| id              |
| userId          |
| workspaceId     |
| role            |
| joinAt          |

Quan hệ N-N giữa User và Workspace

| Task                               |
| ---------------------------------- |
| id                                 |
| title                              |
| description                        |
| createAt                           |
| updateAt                           |
| version                            |
| status (TODO / IN_PROGRESS / DONE) |
| order                              |

1 Workspace - N Task

## 4. Realtime Architecture (Socket.IO)

- Nguyên tắc:
  - Mỗi workspace = 1 room
  - User join room theo workspaceId
  - Event chỉ broadcast trong room
- Flow: Join Workspace

```text
  Client connect socket
          ↓
  Gửi JWT
          ↓
  Server verify token
          ↓
  Client emit: join_workspace(workspaceId)
          ↓
  Server add socket vào room
```

- Flow: Create Task

```text
  Client A → REST API (create task)
            ↓
  Server save DB
            ↓
  Server emit: TASK_CREATED (room workspaceId)
            ↓
  Client B, C nhận event
  ↓
  Update UI
```

- Các event chính:
  JOIN_WORKSPACE;
  LEAVE_WORKSPACE;
  TASK_CREATED;
  TASK_UPDATED;
  TASK_DELETED

## 5. Authentication & Security

-JWT dùng cho cả REST và WebSocket;

- Validate ở:
  - Guard (REST)
  - Gateway (Socket)
- Check quyền:
  - User có thuộc workspace không
  - Có quyền thao tác task không

## 6. Tech Stack

- Backend
  - NestJS
  - Socket.IO
  - PostgreSQL
  - JWT Auth
- Frontend
  - Next.js
  - TypeScript
  - DaisyUI
  - Custom hooks (useApi, useSocket)

## 7. Run Project

- Backend

```bash
cd task-realtime-server
npm install
npm run start:dev
```

- Frontend

```bash
  cd task-realtime-web
  npm install
  npm run dev
```

## 8. Hạn chế hiện tại

- Chưa dùng Redis → chưa scale horizontal
- Realtime đang chạy single instance
- Chưa có queue xử lý event lớn

## 9. Điểm mạnh của hệ thống

- Realtime đúng nghĩa (không polling)
- Phân tách rõ REST vs WebSocket
- Có xử lý concurrent (version)
- Có thiết kế role + workspace isolation

## 10. Demo

Web demo: [Task realtime](https://task-realtime-web.vercel.app/)
