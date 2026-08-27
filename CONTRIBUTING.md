# 🤝 Contributing to Smart Hostel Management System (HMS)

Thank you for your interest in contributing to the **Smart Hostel Management System (HMS)**! 🎉

HMS is an open-source hostel management platform built for **IIIT Sonepat**, utilizing React Native (Expo), TypeScript, Node.js, Express, MongoDB, and Redis.

---

## 📌 Contribution Workflow

HMS uses a **fork-based contribution workflow**. You do not need direct write access to the main repository.

```text
HiteshShonak/Smart-Hostel-IIIT-SONEPAT (Upstream)
                 │
                 │ 1. Fork
                 ↓
       Your GitHub Fork (Origin)
                 │
                 │ 2. Clone & Branch
                 ↓
          Local Development (Frontend & Backend)
                 │
                 │ 3. Test & Verify (tsc, expo, jest)
                 ↓
          Push to Your Fork (Origin)
                 │
                 │ 4. Open Pull Request
                 ↓
        Maintainer Code Review & Merge
```

### ⚡ Quick Steps:
1. **Fork** the repository on GitHub: [HiteshShonak/Smart-Hostel-IIIT-SONEPAT](https://github.com/HiteshShonak/Smart-Hostel-IIIT-SONEPAT)
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Smart-Hostel-IIIT-SONEPAT.git
   cd Smart-Hostel-IIIT-SONEPAT
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/HiteshShonak/Smart-Hostel-IIIT-SONEPAT.git
   ```
4. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or: git checkout -b fix/issue-description
   ```

---

## 🔐 Environment Setup & Secrets

> **Never commit `.env` files or secrets.** Each contributor uses their own local development database and environment variables.

### 1. Backend Setup (`Backend/`)
```bash
cd Backend
npm install
cp .env.example .env
```
Configure your local `Backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hms
JWT_SECRET=your-local-dev-jwt-secret
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
```

### 2. Frontend Setup (`Frontend/`)
```bash
cd ../Frontend
npm install
cp .env.example .env
```
Configure your local `Frontend/.env`:
```env
# Use your computer's LAN IP when testing with Expo Go on a physical phone:
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000/api
```

---

## 🛠️ Code Style & Modular Architecture

- **Modular UI Components**: Keep individual React Native component files focused, maintainable, and strictly under **100–180 lines**.
- **TypeScript**: Strict type-checking enabled. Avoid `any` types wherever possible.
- **Theme Support**: Use `useTheme()` for colors and dark/light mode compatibility.
- **Role-Based Flows**: Test across affected roles (Student, Parent, Warden, Guard, Admin).

---

## 🧪 Testing & Verification

Before submitting a Pull Request, verify that your code compiles cleanly with 0 errors:

### Frontend Verification:
```bash
cd Frontend
# 1. Type-checking
npx tsc --noEmit

# 2. Start Expo local development
npx expo start
```

### Backend Verification:
```bash
cd Backend
# 1. Type-checking & Build
npm run build
npx tsc --noEmit

# 2. Run Tests (if applicable)
npm test
```

---

## 💾 Commits & Pull Requests

### Commit Message Guidelines:
Use clear, imperative commit messages:
- `feat: add quick-adjust time chips to meal scheduler`
- `fix: resolve attendance geofence radius calculation`
- `refactor: modularize gate-pass screen components`
- `docs: update setup and contribution guidelines`

### Submitting a Pull Request:
1. Push your branch to your fork:
   ```bash
   git push -u origin feature/your-feature-name
   ```
2. Open a Pull Request on GitHub against the `main` branch of the official repository.
3. Complete the PR description:
   - **Summary of Changes**: What was added, fixed, or refactored.
   - **Testing Done**: Commands run, device/simulator used, roles tested.
   - **Screenshots / Recordings**: For any UI updates.

---

## 🔒 Security & Vulnerability Reporting

If you discover a security vulnerability (auth bypass, credential leak, data exposure), please **do not open a public GitHub issue**. Contact the project maintainers privately to ensure responsible disclosure.

---

## ❤️ Thank You

Thank you for contributing to the **Smart Hostel Management System**! 🏨  
Built with ❤️ for **IIIT Sonepat**.
