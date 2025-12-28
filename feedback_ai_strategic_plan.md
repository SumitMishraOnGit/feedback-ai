# Feedback AI: Strategic Plan & Technical Roadmap

**Document Version:** 1.0  
**Created:** December 28, 2025  
**Project Status:** Early Development (MVP Foundation)

---

## 📋 Executive Summary

Your concept for **Feedback AI** is solid and addresses a real market need. The conversational approach to feedback collection is a genuine differentiator from traditional form-based tools like Canny.io or UserVoice. However, there are several areas that need attention before moving forward.

This document covers:
1. **Code Quality Issues** (Immediate fixes needed)
2. **Architecture Recommendations**
3. **Feature Prioritization** (What to build first)
4. **Technical Debt Prevention**
5. **Business & Monetization Advice**
6. **Detailed Implementation Roadmap**

---

## 🚨 Part 1: Immediate Code Issues to Fix

### 1.1 Critical Bug in `server.js`

```javascript
// ❌ WRONG ORDER - This will break POST requests
app.use("/api/feedback", feedbackRoutes);  // Routes mounted BEFORE body parser
app.use(express.json());                    // Body parser comes too late

// ✅ CORRECT ORDER
app.use(express.json());                    // Parse body FIRST
app.use("/api/feedback", feedbackRoutes);  // Then mount routes
```

**Impact:** Your `POST /api/feedback` endpoint will receive `undefined` for `req.body`, causing all feedback submissions to fail silently.

### 1.2 Bug in `feedback.controller.js`

```javascript
// ❌ WRONG - Syntax error
res.status.json(newFeedback)  // Line 15 - .status is not a number

// ✅ CORRECT
res.status(201).json(newFeedback)
```

### 1.3 Response Handling Issues

```javascript
// ❌ Current pattern (inconsistent, doesn't stop execution)
if(!content) {
    res.json({ message: "feedback can't be empty"}).status(200)
}
// Code continues to execute and tries to save empty feedback

// ✅ Better pattern (proper validation with return)
if (!content) {
    return res.status(400).json({ 
        success: false,
        message: "Feedback content is required" 
    });
}
```

### 1.4 Missing CORS Middleware

You have `cors` installed but not used in `server.js`. This will block frontend requests:

```javascript
const cors = require('cors');
app.use(cors()); // Add this before routes
```

---

## 🏗️ Part 2: Architecture Recommendations

### 2.1 Backend Folder Structure (Recommended)

```
server/
├── config/
│   ├── db.js              # MongoDB connection logic
│   └── gemini.js          # Gemini AI configuration
├── controllers/
│   ├── feedback.controller.js
│   ├── auth.controller.js
│   └── widget.controller.js
├── middleware/
│   ├── auth.middleware.js  # JWT verification
│   ├── rateLimit.js        # API rate limiting
│   └── validate.js         # Zod validation middleware
├── models/
│   ├── Feedback.js
│   ├── User.js             # Client/Owner accounts
│   └── Widget.js           # Widget configuration per client
├── routes/
│   ├── v1/                 # Version your APIs from the start
│   │   ├── feedback.routes.js
│   │   ├── auth.routes.js
│   │   └── widget.routes.js
│   └── index.js
├── services/
│   ├── ai.service.js       # Gemini API logic
│   └── email.service.js    # Notifications
├── utils/
│   └── responseHandler.js  # Consistent API responses
├── validators/
│   └── feedback.validator.js  # Zod schemas
├── .env.example
└── server.js
```

### 2.2 Client Folder Structure (Recommended for React + Vite)

```
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (buttons, modals)
│   │   ├── widget/          # The embeddable widget components
│   │   └── dashboard/       # Admin dashboard components
│   ├── contexts/            # React Context providers
│   ├── hooks/               # Custom hooks
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── WidgetPreview.jsx
│   ├── services/
│   │   └── api.js           # Axios/fetch configurations
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

### 2.3 Data Models to Design Now

#### User Model (Client/Owner)
```javascript
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String },
  plan: { type: String, enum: ['free', 'standard', 'premium'], default: 'free' },
  apiKey: { type: String, unique: true },  // For widget authentication
  widgetSettings: {
    primaryColor: { type: String, default: '#6366f1' },
    position: { type: String, enum: ['bottom-right', 'bottom-left'], default: 'bottom-right' },
    greeting: { type: String, default: 'Hi! How can we help?' },
    enabledUrls: [{ type: String }],  // For V2 navigation feature
  },
  createdAt: { type: Date, default: Date.now },
});
```

#### Enhanced Feedback Model
```javascript
const feedbackSchema = new mongoose.Schema({
  // Core fields
  content: { type: String, required: true },
  
  // AI-generated fields
  title: { type: String },  // AI-generated summary
  category: { 
    type: String, 
    enum: ['bug', 'feature', 'improvement', 'question', 'other'],
    default: 'other'
  },
  
  // Association
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Engagement
  upvotes: { type: Number, default: 0 },
  upvotersFingerprints: [{ type: String }],  // Anonymous tracking
  
  // Management
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'planned', 'in-progress', 'completed'],
    default: 'pending'
  },
  isPublic: { type: Boolean, default: false },  // Shows in widget
  
  // Metadata
  submitterMeta: {
    userAgent: String,
    pageUrl: String,
    sessionId: String,
  },
}, { timestamps: true });
```

---

## 🎯 Part 3: Feature Prioritization (MVP Focus)

### Phase 1: Foundation (Weeks 1-2) ✅ You're here
| Task | Priority | Status |
|------|----------|--------|
| Fix critical backend bugs | Critical | 🔴 Pending |
| Add Zod validation | High | 🔴 Pending |
| Add CORS middleware | High | 🔴 Pending |
| Implement User auth (JWT) | High | 🔴 Pending |
| Design complete Feedback schema | High | 🔴 Pending |

### Phase 2: Core Widget (Weeks 2-4)
| Task | Priority | Notes |
|------|----------|-------|
| Embeddable widget script | Critical | Single `<script>` tag integration |
| Basic chat UI | Critical | Clean, mobile-friendly bubble |
| API key authentication | Critical | Widget authenticates to backend |
| Feedback submission flow | Critical | Just text for now, no AI |

### Phase 3: AI Integration (Weeks 4-5)
| Task | Priority | Notes |
|------|----------|-------|
| Gemini API integration | High | Title + category generation |
| Conversational follow-ups | Medium | AI asks clarifying questions |
| Rate limiting for AI calls | High | Prevent abuse |

### Phase 4: Dashboard MVP (Weeks 5-7)
| Task | Priority | Notes |
|------|----------|-------|
| Client login/signup | Critical | Simple email/password |
| Feedback list view | Critical | Table with status, category |
| Approve/Reject actions | Critical | One-click moderation |
| Status management | High | Drag-and-drop kanban style |
| Widget customization | Medium | Color picker, greeting text |

### Phase 5: Social Proof & Upvoting (Week 7-8)
| Task | Priority | Notes |
|------|----------|-------|
| Public feedback display in widget | Medium | Shows approved items |
| Anonymous upvoting | Medium | Fingerprint-based (no login) |
| "Trending" sorting | Low | Sort by upvotes |

### Phase 6: V2 - Navigational AI (Future)
| Task | Priority | Notes |
|------|----------|-------|
| URL registry in dashboard | Low | Owner lists key pages |
| Intent detection | Low | "Navigation" vs "Feedback" |
| Contextual responses | Low | AI guides user to pages |

---

## 💡 Part 4: Strategic Advice

### 4.1 Business Model Refinement

**Your current tiering is good, but consider this structure:**

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 50 feedbacks/month, basic widget, no AI |
| **Starter** | $19/month | 500 feedbacks, AI categorization, 1 team member |
| **Pro** | $49/month | Unlimited feedbacks, AI conversations, 5 team, custom branding |
| **Enterprise** | $199/month | V2 Navigation AI, SSO, API access, priority support |

**Key insight:** The "Navigation AI" feature is your **premium upsell** — guard it carefully. It's a "sticky" feature that makes switching away painful.

### 4.2 Competitive Positioning

You mentioned Canny.io, Intercom, and Stripe as inspiration. Here's how to differentiate:

| Competitor | Their Strength | Your Angle |
|------------|----------------|------------|
| **Canny.io** | Roadmap/voting boards | More conversational, AI-first |
| **Intercom** | Live chat, sales focus | Feedback-only, simpler, cheaper |
| **UserVoice** | Enterprise-heavy | SMB-friendly, modern UI |

**Your pitch:** *"Canny meets ChatGPT — feedback that talks back."*

### 4.3 Technical Decisions to Make Now

1. **How will the widget be distributed?**
   - Option A: Single `<script>` tag (like Intercom) — **Recommended**
   - Option B: npm package for React sites
   - **My advice:** Start with script tag. Works everywhere, no framework lock-in.

2. **Where to host?**
   - Backend: Railway, Render, or Fly.io (easy, cheap)
   - Frontend Dashboard: Vercel or Netlify
   - Widget CDN: Cloudflare R2 or AWS CloudFront

3. **Database hosting:**
   - MongoDB Atlas (free tier is generous, 512MB)
   - Start free, upgrade when you have paying users

### 4.4 What NOT to Build Yet

- ❌ Email notifications (do them manually at first)
- ❌ Team management (single-user is fine for MVP)
- ❌ Integrations (Slack, Discord, etc.) — wait for user demand
- ❌ Mobile app — your dashboard should be responsive instead
- ❌ Overly complex analytics — simple counts are enough

---

## 📅 Part 5: 8-Week MVP Roadmap

### Week 1-2: Backend Foundation
- [ ] Fix current bugs (middleware order, response handling)
- [ ] Implement User model with auth (JWT)
- [ ] Add Zod validation for all endpoints
- [ ] Create `/api/v1/auth` routes (register, login, me)
- [ ] Create API key generation for widgets
- [ ] Set up proper error handling middleware

### Week 3: Widget Foundation
- [ ] Create embeddable widget as standalone JS bundle
- [ ] Build chat bubble UI (floating icon → modal)
- [ ] Implement feedback submission via API
- [ ] Test embedding on a sample HTML page

### Week 4: Dashboard Skeleton
- [ ] Set up React Router for dashboard pages
- [ ] Build login/register pages
- [ ] Create basic layout (sidebar, header)
- [ ] Implement protected routes with JWT

### Week 5: AI Integration
- [ ] Integrate Gemini API for title/category generation
- [ ] Add background job for AI processing (avoid blocking requests)
- [ ] Implement rate limiting for AI calls
- [ ] Add fallback if AI fails

### Week 6: Dashboard Core Features
- [ ] Build feedback list with filters (status, category)
- [ ] Implement approve/reject actions
- [ ] Add status change dropdown
- [ ] Build basic analytics (total feedbacks, by category)

### Week 7: Widget Customization
- [ ] Add widget settings to dashboard (color, greeting)
- [ ] Implement "get embed code" feature
- [ ] Build widget preview in dashboard
- [ ] Add public feedback display in widget

### Week 8: Polish & Launch Prep
- [ ] Responsive design for all pages
- [ ] Loading states and error handling
- [ ] SEO basics for marketing site
- [ ] Write documentation / setup guide
- [ ] Deploy to production

---

## 🔧 Part 6: Immediate Action Items

### Today's Priority (Fix Critical Issues)

1. **Fix `server.js` middleware order**
2. **Fix `feedback.controller.js` response handling**
3. **Add CORS middleware**
4. **Add Zod validation for feedback endpoint**

### This Week's Goals

1. Design and implement the complete Feedback schema
2. Add User model and JWT authentication
3. Create versioned API routes (`/api/v1/...`)
4. Set up proper error handling middleware

---

## 📝 Notes & Questions for You

1. **Gemini API:** Do you have API access set up? Free tier has generous limits for MVPs.

2. **Hosting plan:** Where do you plan to deploy? I can help optimize for your choice.

3. **Widget distribution:** Are your target users primarily React developers, or general websites? This affects how you build the embeddable widget.

4. **Monetization timeline:** Are you building this to learn, or do you have a launch date in mind? This affects feature scope.

---

*This plan will be updated as we progress. Feel free to ask me to expand on any section.*
