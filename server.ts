import express from "express";
import cors from "cors";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretcarsmechanicjwtsecretkey123456789";

app.use(cors());
app.use(express.json());

// In-Memory Database
interface Role {
  id: number;
  role: string;
  authority: string;
}

interface User {
  id: number;
  username: string;
  fullName: string;
  password?: string;
  roles: Role[];
  created_At?: string;
  updated_At?: string;
}

interface Workshop {
  id: number;
  name: string;
  description: string;
  phone: string;
  city: string;
  street: string;
  postalCode: string;
  owner: string;
  accepted: boolean;
  created_At: string;
  user?: User;
  opinions?: Opinion[];
}

interface Offer {
  offerId: number;
  id?: number;
  price: number;
  estTime: string;
  preferedDate: string;
  description: string;
  offeredByUser: string;
  offeredByWorkshopId: number;
  workshop?: Workshop;
  issue?: any;
  created_At: string;
}

interface Issue {
  issueId: number;
  id?: number;
  title: string;
  carModel: string;
  brand: string;
  engine: string;
  yearOfProduction: string;
  category: string;
  description: string;
  city: string;
  dateFrom: string;
  dateTo: string;
  status: "TO DO" | "IN PROGRESS" | "DONE";
  issueLeader: string;
  opinioned: boolean;
  user?: User;
  acceptedOffer?: Offer | null;
  offers?: Offer[];
  created_At: string;
  updated_At?: string;
}

interface Opinion {
  opinionId: number;
  id?: number;
  score: number;
  description: string;
  opinionedByIssueId: number;
  reported: boolean;
  banned: boolean;
  creationDate: string;
  user?: { id: number; username: string; fullName: string };
  workshop?: { id: number; name: string; owner: string };
  issue?: any;
}

const ROLE_USER: Role = { id: 1, role: "USER", authority: "ROLE_USER" };
const ROLE_ADMIN: Role = { id: 2, role: "ADMIN", authority: "ROLE_ADMIN" };
const ROLE_OWNER: Role = { id: 3, role: "WORKSHOPOWNER", authority: "ROLE_WORKSHOPOWNER" };

// Seed Users
const users: User[] = [
  {
    id: 1,
    username: "admin@carsmechanic.com",
    fullName: "System Administrator",
    password: bcrypt.hashSync("password123", 10),
    roles: [ROLE_USER, ROLE_ADMIN],
    created_At: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 2,
    username: "owner@autofix.com",
    fullName: "Marek Kowalski (AutoFix Pro)",
    password: bcrypt.hashSync("password123", 10),
    roles: [ROLE_USER, ROLE_OWNER],
    created_At: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 3,
    username: "john@example.com",
    fullName: "Jan Nowak (Car Owner)",
    password: bcrypt.hashSync("password123", 10),
    roles: [ROLE_USER],
    created_At: new Date(Date.now() - 10 * 86400000).toISOString()
  }
];

// Seed Workshops
const workshops: Workshop[] = [
  {
    id: 1,
    name: "AutoFix Pro Garage",
    description: "Kompleksowa naprawa samochodów osobowych i dostawczych. Diagnostyka komputerowa, mechanika precyzyjna, serwis klimatyzacji.",
    phone: "+48 501 234 567",
    city: "Warszawa",
    street: "ul. Mechaników 12",
    postalCode: "01-234",
    owner: "owner@autofix.com",
    accepted: true,
    created_At: new Date(Date.now() - 18 * 86400000).toISOString()
  },
  {
    id: 2,
    name: "Speedy Car Service",
    description: "Specjalizacja w układach hamulcowych, zawieszeniu i silnikach turbodoładowanych.",
    phone: "+48 602 987 654",
    city: "Kraków",
    street: "ul. Samochodowa 45",
    postalCode: "30-100",
    owner: "owner@autofix.com",
    accepted: true,
    created_At: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    id: 3,
    name: "Electro-Car Diagnostic Center",
    description: "Nowo zgłoszony warsztat specjalizujący się w elektronice pojazdowej i hybrydach.",
    phone: "+48 703 112 233",
    city: "Wrocław",
    street: "ul. Prądowa 8",
    postalCode: "50-200",
    owner: "owner@autofix.com",
    accepted: false,
    created_At: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

// Seed Offers & Issues
const offers: Offer[] = [
  {
    offerId: 1,
    id: 1,
    price: 450,
    estTime: "2 dni",
    preferedDate: "2025-05-10",
    description: "Wymiana klocków i tarcz hamulcowych na oryginalnych częściach Bosch.",
    offeredByUser: "owner@autofix.com",
    offeredByWorkshopId: 1,
    workshop: workshops[0],
    created_At: new Date().toISOString()
  }
];

const issues: Issue[] = [
  {
    issueId: 1,
    id: 1,
    title: "Głośne stuki w przednim zawieszeniu",
    brand: "Volkswagen",
    carModel: "Golf VII",
    engine: "2.0 TDI",
    yearOfProduction: "2016",
    category: "suspension",
    description: "Przy przejeżdżaniu przez nierówności słychać wyraźne metaliczne stuki z prawej strony.",
    city: "Warszawa",
    dateFrom: "2025-05-01",
    dateTo: "2025-05-20",
    status: "TO DO",
    issueLeader: "john@example.com",
    opinioned: false,
    offers: [offers[0]],
    acceptedOffer: null,
    created_At: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    issueId: 2,
    id: 2,
    title: "Spadek mocy i kontrolka Check Engine",
    brand: "Audi",
    carModel: "A4 B8",
    engine: "2.0 TFSI",
    yearOfProduction: "2014",
    category: "engine",
    description: "Samochód szarpie przy przyspieszaniu powyżej 3000 obrotów.",
    city: "Warszawa",
    dateFrom: "2025-04-10",
    dateTo: "2025-04-25",
    status: "IN PROGRESS",
    issueLeader: "john@example.com",
    opinioned: false,
    acceptedOffer: {
      offerId: 2,
      id: 2,
      price: 800,
      estTime: "3 dni",
      preferedDate: "2025-04-15",
      description: "Diagnostyka układu zapłonowego i wymiana cewek.",
      offeredByUser: "owner@autofix.com",
      offeredByWorkshopId: 1,
      workshop: workshops[0],
      created_At: new Date().toISOString()
    },
    offers: [],
    created_At: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    issueId: 3,
    id: 3,
    title: "Wymiana rozrządu i pompy wody",
    brand: "Skoda",
    carModel: "Octavia III",
    engine: "1.6 TDI",
    yearOfProduction: "2017",
    category: "engine",
    description: "Okresowa wymiana kompletnego rozrządu wg zaleceń producenta.",
    city: "Warszawa",
    dateFrom: "2025-03-01",
    dateTo: "2025-03-15",
    status: "DONE",
    issueLeader: "john@example.com",
    opinioned: true,
    acceptedOffer: {
      offerId: 3,
      id: 3,
      price: 1200,
      estTime: "1 dzień",
      preferedDate: "2025-03-10",
      description: "Kompletny rozrząd Contitech z pompą wody i płynem chłodniczym.",
      offeredByUser: "owner@autofix.com",
      offeredByWorkshopId: 1,
      workshop: workshops[0],
      created_At: new Date().toISOString()
    },
    offers: [],
    created_At: new Date(Date.now() - 25 * 86400000).toISOString()
  }
];

// Seed Opinions
const opinions: Opinion[] = [
  {
    opinionId: 1,
    id: 1,
    score: 5,
    description: "Świetna i szybka robota! Rozrząd wymieniony w 1 dzień, kulturalna obsługa i uczciwa cena.",
    opinionedByIssueId: 3,
    reported: false,
    banned: false,
    creationDate: new Date(Date.now() - 15 * 86400000).toISOString().split("T")[0],
    user: { id: 3, username: "john@example.com", fullName: "Jan Nowak" },
    workshop: { id: 1, name: "AutoFix Pro Garage", owner: "owner@autofix.com" },
    issue: { issueId: 3, id: 3, title: "Wymiana rozrządu i pompy wody", carModel: "Skoda Octavia III" }
  },
  {
    opinionId: 2,
    id: 2,
    score: 1,
    description: "Nie polecam, długi czas oczekiwania i drogo. (Opinia zgłoszona do weryfikacji)",
    opinionedByIssueId: 3,
    reported: true,
    banned: false,
    creationDate: new Date(Date.now() - 5 * 86400000).toISOString().split("T")[0],
    user: { id: 3, username: "john@example.com", fullName: "Jan Nowak" },
    workshop: { id: 1, name: "AutoFix Pro Garage", owner: "owner@autofix.com" },
    issue: { issueId: 3, id: 3, title: "Wymiana rozrządu i pompy wody", carModel: "Skoda Octavia III" }
  }
];

let nextUserId = 4;
let nextWorkshopId = 4;
let nextIssueId = 4;
let nextOfferId = 4;
let nextOpinionId = 3;

// Helper to format user for API
const formatUser = (u: User) => {
  const userIssues = issues.filter(i => i.issueLeader === u.username);
  const userWorkshops = workshops.filter(w => w.owner === u.username);
  const formattedRoles = (u.roles || []).map(r => ({
    id: r.id,
    name: (r as any).name || r.role,
    role: r.role,
    authority: r.authority || `ROLE_${r.role}`
  }));

  return {
    id: u.id,
    username: u.username,
    fullName: u.fullName,
    roles: formattedRoles,
    created_At: u.created_At,
    create_At: u.created_At ? u.created_At.split("T")[0] : "",
    updated_At: u.updated_At,
    update_At: u.updated_At ? u.updated_At.split("T")[0] : "",
    issues: userIssues.map(i => ({
      issueId: i.issueId || i.id,
      title: i.title,
      carModel: i.carModel,
      status: i.status
    })),
    workshops: userWorkshops.map(w => ({
      id: w.id,
      name: w.name,
      city: w.city,
      accepted: w.accepted
    }))
  };
};

// Helper to format workshop for API
const formatWorkshop = (w: Workshop, includeOpinions: boolean = true): any => {
  const workshopOpinions = includeOpinions
    ? opinions
        .filter(o => o.workshop && o.workshop.id === w.id && !o.banned)
        .map(o => formatOpinion(o, false))
    : [];
  return {
    id: w.id,
    name: w.name,
    description: w.description,
    phone: w.phone,
    telephone: w.phone,
    city: w.city,
    street: w.street,
    postalCode: w.postalCode,
    address: `${w.street || ""}, ${w.postalCode || ""} ${w.city || ""}`.trim().replace(/^, /, ""),
    owner: w.owner,
    accepted: w.accepted,
    created_At: w.created_At,
    creationDate: w.created_At ? w.created_At.split("T")[0] : "",
    opinions: workshopOpinions
  };
};

// Helper to format offer for API
const formatOffer = (o: Offer): any => {
  const workshop = workshops.find(w => w.id === o.offeredByWorkshopId) || o.workshop || workshops[0];
  return {
    offerId: o.offerId || o.id,
    id: o.offerId || o.id,
    price: o.price,
    estTime: o.estTime,
    preferedDate: o.preferedDate,
    description: o.description,
    offeredByUser: o.offeredByUser,
    offeredByWorkshopId: o.offeredByWorkshopId,
    created_At: o.created_At,
    workshop: formatWorkshop(workshop, false)
  };
};

// Helper to format issue for API
const formatIssue = (i: Issue): any => {
  const issueOffers = offers
    .filter(o => (o.issue && (o.issue.issueId === i.issueId || o.issue.id === i.issueId)) || o.offeredByWorkshopId)
    .filter(o => o.issue ? (o.issue.issueId === i.issueId || o.issue.id === i.issueId) : (i.offers && i.offers.some(io => io.offerId === o.offerId)));
  
  return {
    issueId: i.issueId || i.id,
    id: i.issueId || i.id,
    title: i.title,
    brand: i.brand,
    carModel: i.carModel,
    engine: i.engine,
    yearOfProduction: i.yearOfProduction,
    category: i.category,
    description: i.description,
    city: i.city,
    dateFrom: i.dateFrom,
    dateTo: i.dateTo,
    status: i.status,
    issueLeader: i.issueLeader,
    opinioned: i.opinioned,
    created_At: i.created_At,
    creationDate: i.created_At ? i.created_At.split("T")[0] : "",
    localization: i.city || "",
    type: i.category || "General",
    offers: (issueOffers.length > 0 ? issueOffers : i.offers || []).map(formatOffer),
    acceptedOffer: i.acceptedOffer ? formatOffer(i.acceptedOffer) : null
  };
};

// Helper to format opinion for API
const formatOpinion = (op: Opinion, includeWorkshopNested: boolean = true): any => {
  const opUser = users.find(u => u.username === (op.user?.username || (op as any).opinionLeader)) || op.user || { id: 0, fullName: "User", username: "" };
  const opWorkshop = workshops.find(w => w.id === (op.workshop?.id)) || op.workshop || workshops[0];
  const opIssue = issues.find(i => i.issueId === op.opinionedByIssueId) || op.issue || { issueId: op.opinionedByIssueId, title: "Repair", carModel: "" };

  return {
    opinionId: op.opinionId || op.id,
    id: op.opinionId || op.id,
    score: op.score,
    rate: op.score,
    description: op.description,
    opinionedByIssueId: op.opinionedByIssueId,
    reported: op.reported,
    banned: op.banned,
    creationDate: op.creationDate ? op.creationDate.split("T")[0] : "",
    user: { id: opUser.id, username: opUser.username, fullName: opUser.fullName },
    workshop: includeWorkshopNested
      ? {
          id: opWorkshop.id,
          name: opWorkshop.name,
          phone: opWorkshop.phone,
          telephone: opWorkshop.phone,
          city: opWorkshop.city,
          street: opWorkshop.street,
          postalCode: opWorkshop.postalCode,
          address: `${opWorkshop.street || ""}, ${opWorkshop.postalCode || ""} ${opWorkshop.city || ""}`.trim().replace(/^, /, ""),
          owner: opWorkshop.owner,
          accepted: opWorkshop.accepted
        }
      : { id: opWorkshop.id, name: opWorkshop.name, owner: opWorkshop.owner },
    issue: {
      issueId: opIssue.issueId || opIssue.id,
      title: opIssue.title,
      carModel: opIssue.carModel || ""
    }
  };
};

// Helper: JWT auth middleware
const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ==================== USER & AUTH ROUTES ====================

app.post("/users/register", (req, res) => {
  const { username, fullName, password, confirmPassword } = req.body;
  const errors: Record<string, string> = {};

  if (!fullName || !fullName.trim()) errors.fullName = "Please enter your full name";
  if (!username || !username.trim()) errors.username = "Please enter username (email)";
  if (!password || password.length < 6) errors.password = "Password must be at least 6 characters";
  if (password !== confirmPassword) errors.confirmPassword = "Passwords must match";

  if (users.some(u => u.username.toLowerCase() === (username || "").toLowerCase())) {
    errors.username = `Username '${username}' already exists`;
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  const newUser: User = {
    id: nextUserId++,
    username,
    fullName,
    password: bcrypt.hashSync(password, 10),
    roles: [ROLE_USER],
    created_At: new Date().toISOString()
  };
  users.push(newUser);

  res.status(201).json({
    id: newUser.id,
    username: newUser.username,
    fullName: newUser.fullName,
    roles: newUser.roles
  });
});

app.post("/users/login", (req, res) => {
  const { username, password } = req.body;
  const errors: Record<string, string> = {};

  if (!username) errors.username = "Please enter username";
  if (!password) errors.password = "Please enter password";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user || !user.password || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({
      username: "Invalid Username or Password",
      password: "Invalid Username or Password"
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    roles: user.roles
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  res.json({
    success: true,
    token: `Bearer ${token}`
  });
});

app.get("/users/getUser", authMiddleware, (req: any, res) => {
  const user = users.find(u => u.username === req.user.username);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    roles: user.roles,
    created_At: user.created_At
  });
});

app.patch("/users/editUser", authMiddleware, (req: any, res) => {
  const user = users.find(u => u.username === req.user.username);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { fullName, password } = req.body;
  if (fullName) user.fullName = fullName;
  if (password && password.trim()) {
    user.password = bcrypt.hashSync(password, 10);
  }
  user.updated_At = new Date().toISOString();

  res.json({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    roles: user.roles
  });
});

// ==================== ADMIN ROUTES ====================

app.get("/admin/getUsers", authMiddleware, (req, res) => {
  res.json(users.map(formatUser));
});

app.get("/admin/getPagedUsers", authMiddleware, (req, res) => {
  const pageSize = parseInt(req.query.pageSize as string) || 5;
  const pageNo = parseInt(req.query.pageNo as string) || 0;
  const formattedUsers = users.map(formatUser);
  const start = pageNo * pageSize;
  const content = formattedUsers.slice(start, start + pageSize);

  res.json({
    content,
    totalPages: Math.ceil(formattedUsers.length / pageSize) || 1,
    totalElements: formattedUsers.length,
    size: pageSize,
    number: pageNo
  });
});

app.get("/admin/findUserById/:id", authMiddleware, (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(formatUser(user));
});

app.patch("/admin/AdminEditUser", authMiddleware, (req, res) => {
  const { id, username, fullName, password } = req.body;
  const user = users.find(u => u.id === parseInt(id));
  if (!user) return res.status(404).json({ message: "User not found" });

  if (username) user.username = username;
  if (fullName) user.fullName = fullName;
  if (password && password.trim()) {
    user.password = bcrypt.hashSync(password, 10);
  }
  user.updated_At = new Date().toISOString();

  res.json(formatUser(user));
});

app.patch("/admin/addAdmin/:id", authMiddleware, (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.roles.some(r => r.role === "ADMIN")) {
    user.roles.push(ROLE_ADMIN);
  }
  res.json(formatUser(user));
});

app.delete("/admin/deleteUserById/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users.splice(index, 1);
  }
  res.json({ message: `User with ID ${id} was deleted` });
});

app.get("/admin/getWorkshops", authMiddleware, (req, res) => {
  res.json(workshops.map(formatWorkshop));
});

app.get("/admin/getPagedAcceptedWorkshops", authMiddleware, (req, res) => {
  const pageSize = parseInt(req.query.pageSize as string) || 5;
  const pageNo = parseInt(req.query.pageNo as string) || 0;
  const accepted = workshops.filter(w => w.accepted === true).map(formatWorkshop);
  const start = pageNo * pageSize;
  const content = accepted.slice(start, start + pageSize);

  res.json({
    content,
    totalPages: Math.ceil(accepted.length / pageSize) || 1,
    totalElements: accepted.length,
    size: pageSize,
    number: pageNo
  });
});

app.get("/admin/getPagedPendingWorkshops", authMiddleware, (req, res) => {
  const pageSize = parseInt(req.query.pageSize as string) || 5;
  const pageNo = parseInt(req.query.pageNo as string) || 0;
  const pending = workshops.filter(w => w.accepted === false).map(formatWorkshop);
  const start = pageNo * pageSize;
  const content = pending.slice(start, start + pageSize);

  res.json({
    content,
    totalPages: Math.ceil(pending.length / pageSize) || 1,
    totalElements: pending.length,
    size: pageSize,
    number: pageNo
  });
});

app.patch("/admin/acceptWorkshop/:id", authMiddleware, (req, res) => {
  const workshop = workshops.find(w => w.id === parseInt(req.params.id));
  if (!workshop) return res.status(404).json({ message: "Workshop not found" });
  workshop.accepted = true;
  res.json(formatWorkshop(workshop));
});

app.delete("/admin/deleteWorkshopById/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const index = workshops.findIndex(w => w.id === id);
  if (index !== -1) {
    workshops.splice(index, 1);
  }
  res.json({ message: `Workshop with ID ${id} was deleted` });
});

app.get("/admin/getReportedOpinions", authMiddleware, (req, res) => {
  res.json(opinions.filter(o => o.reported === true && o.banned !== true).map(formatOpinion));
});

app.get("/admin/getPagedReportedOpinions", authMiddleware, (req, res) => {
  const pageSize = parseInt(req.query.pageSize as string) || 5;
  const pageNo = parseInt(req.query.pageNo as string) || 0;
  const reported = opinions.filter(o => o.reported === true && o.banned !== true).map(formatOpinion);
  const start = pageNo * pageSize;

  res.json({
    content: reported.slice(start, start + pageSize),
    totalPages: Math.ceil(reported.length / pageSize) || 1,
    totalElements: reported.length,
    size: pageSize,
    number: pageNo
  });
});

app.get("/admin/getPagedBannedOpinions", authMiddleware, (req, res) => {
  const pageSize = parseInt(req.query.pageSize as string) || 5;
  const pageNo = parseInt(req.query.pageNo as string) || 0;
  const banned = opinions.filter(o => o.banned === true).map(formatOpinion);
  const start = pageNo * pageSize;

  res.json({
    content: banned.slice(start, start + pageSize),
    totalPages: Math.ceil(banned.length / pageSize) || 1,
    totalElements: banned.length,
    size: pageSize,
    number: pageNo
  });
});

app.patch("/admin/banOpinion/:id", authMiddleware, (req, res) => {
  const op = opinions.find(o => o.opinionId === parseInt(req.params.id) || o.id === parseInt(req.params.id));
  if (!op) return res.status(404).json({ message: "Opinion not found" });
  op.banned = true;
  res.json(formatOpinion(op));
});

app.patch("/admin/unbanOpinion/:id", authMiddleware, (req, res) => {
  const op = opinions.find(o => o.opinionId === parseInt(req.params.id) || o.id === parseInt(req.params.id));
  if (!op) return res.status(404).json({ message: "Opinion not found" });
  op.banned = false;
  op.reported = false;
  res.json(formatOpinion(op));
});

app.patch("/admin/unreportOpinion/:id", authMiddleware, (req, res) => {
  const op = opinions.find(o => o.opinionId === parseInt(req.params.id) || o.id === parseInt(req.params.id));
  if (!op) return res.status(404).json({ message: "Opinion not found" });
  op.reported = false;
  res.json(formatOpinion(op));
});

app.get("/admin/getOpinionsByUserId/:id", authMiddleware, (req, res) => {
  const userId = parseInt(req.params.id);
  res.json(opinions.filter(o => o.user && o.user.id === userId).map(formatOpinion));
});

// ==================== WORKSHOP ROUTES ====================

app.post("/workshop/add", authMiddleware, (req: any, res) => {
  const { name, description, phone, city, street, postalCode } = req.body;
  const errors: Record<string, string> = {};

  if (!name) errors.name = "Workshop name is required";
  if (!phone) errors.phone = "Phone number is required";
  if (!city) errors.city = "City is required";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  const user = users.find(u => u.username === req.user.username);
  if (user && !user.roles.some(r => r.role === "WORKSHOPOWNER")) {
    user.roles.push(ROLE_OWNER);
  }

  const newWorkshop: Workshop = {
    id: nextWorkshopId++,
    name,
    description: description || "",
    phone,
    city,
    street: street || "",
    postalCode: postalCode || "",
    owner: req.user.username,
    accepted: false,
    created_At: new Date().toISOString()
  };
  workshops.push(newWorkshop);

  res.status(201).json(formatWorkshop(newWorkshop));
});

app.get("/workshop/getAll", authMiddleware, (req: any, res) => {
  res.json(workshops.filter(w => w.owner === req.user.username).map(formatWorkshop));
});

app.get("/workshop/findById/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const workshop = workshops.find(w => w.id === id);
  if (!workshop) return res.status(404).json({ message: "Workshop not found" });
  
  res.json(formatWorkshop(workshop));
});

// ==================== ISSUE ROUTES ====================

app.post("/issue/add", authMiddleware, (req: any, res) => {
  const {
    issueId,
    title,
    carModel,
    brand,
    engine,
    yearOfProduction,
    category,
    description,
    city,
    dateFrom,
    dateTo
  } = req.body;

  const errors: Record<string, string> = {};
  if (!title) errors.title = "Title is required";
  if (!brand) errors.brand = "Brand is required";
  if (!carModel) errors.carModel = "Car model is required";
  if (!description) errors.description = "Description is required";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  if (issueId) {
    const existing = issues.find(i => i.issueId === parseInt(issueId));
    if (!existing) return res.status(404).json({ message: "Issue not found" });
    if (existing.status === "IN PROGRESS" || existing.status === "DONE") {
      return res.status(400).json({ message: "Cannot edit issue already in progress or done" });
    }
    existing.title = title;
    existing.carModel = carModel;
    existing.brand = brand;
    existing.engine = engine;
    existing.yearOfProduction = yearOfProduction;
    existing.category = category;
    existing.description = description;
    existing.city = city;
    existing.dateFrom = dateFrom;
    existing.dateTo = dateTo;
    existing.updated_At = new Date().toISOString();
    return res.json(formatIssue(existing));
  }

  const newIssue: Issue = {
    issueId: nextIssueId,
    id: nextIssueId++,
    title,
    carModel,
    brand,
    engine: engine || "",
    yearOfProduction: yearOfProduction || "",
    category: category || "other",
    description,
    city: city || "",
    dateFrom: dateFrom || new Date().toISOString().split("T")[0],
    dateTo: dateTo || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    status: "TO DO",
    issueLeader: req.user.username,
    opinioned: false,
    offers: [],
    acceptedOffer: null,
    created_At: new Date().toISOString()
  };
  issues.push(newIssue);

  res.status(201).json(formatIssue(newIssue));
});

app.get("/issue/getAll", authMiddleware, (req: any, res) => {
  res.json(issues.filter(i => i.issueLeader === req.user.username).map(formatIssue));
});

app.get("/issue/getAllToOpinion/:workshopId", authMiddleware, (req: any, res) => {
  const workshopId = parseInt(req.params.workshopId);
  const userIssues = issues.filter(
    i =>
      i.issueLeader === req.user.username &&
      i.status === "DONE" &&
      i.acceptedOffer &&
      i.acceptedOffer.workshop &&
      i.acceptedOffer.workshop.id === workshopId &&
      !i.opinioned
  );
  res.json(userIssues.map(formatIssue));
});

app.get("/issue/findById/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const issue = issues.find(i => i.issueId === id || i.id === id);
  if (!issue) return res.status(404).json({ message: "Issue not found" });
  
  res.json(formatIssue(issue));
});

app.delete("/issue/deleteById/:id", authMiddleware, (req: any, res) => {
  const id = parseInt(req.params.id);
  const index = issues.findIndex(i => i.issueId === id || i.id === id);
  if (index !== -1) {
    if (issues[index].status === "IN PROGRESS" || issues[index].status === "DONE") {
      return res.status(400).json({ message: "Cannot delete issue in progress or done" });
    }
    issues.splice(index, 1);
  }
  res.json({ message: `Issue with ID ${id} was deleted` });
});

app.post("/issue/done/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const issue = issues.find(i => i.issueId === id || i.id === id);
  if (!issue) return res.status(404).json({ message: "Issue not found" });
  issue.status = "DONE";
  res.json(formatIssue(issue));
});

// ==================== OWNER ROUTES ====================

app.get("/owner/getIssues", authMiddleware, (req, res) => {
  res.json(issues.filter(i => i.status === "TO DO").map(formatIssue));
});

app.get("/owner/getIssuesOffered", authMiddleware, (req: any, res) => {
  const username = req.user.username;
  const offeredIssues = issues.filter(
    i =>
      (i.offers && i.offers.some(o => o.offeredByUser === username)) ||
      (i.acceptedOffer && i.acceptedOffer.offeredByUser === username)
  );
  res.json(offeredIssues.map(formatIssue));
});

app.patch("/owner/reportOpinion/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const op = opinions.find(o => o.opinionId === id || o.id === id);
  if (!op) return res.status(404).json({ message: "Opinion not found" });
  op.reported = true;
  res.json(formatOpinion(op));
});

app.patch("/owner/unreportOpinion/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const op = opinions.find(o => o.opinionId === id || o.id === id);
  if (!op) return res.status(404).json({ message: "Opinion not found" });
  op.reported = false;
  res.json(formatOpinion(op));
});

// ==================== OFFER ROUTES ====================

app.get("/offer/:issueId", authMiddleware, (req, res) => {
  const issueId = parseInt(req.params.issueId);
  const issue = issues.find(i => i.issueId === issueId || i.id === issueId);
  if (!issue) return res.status(404).json({ message: "Issue not found" });
  
  const issueOffers = offers.filter(o => o.issue && (o.issue.issueId === issueId || o.issue.id === issueId));
  const resultOffers = issueOffers.length > 0 ? issueOffers : (issue.offers || []);
  res.json(resultOffers.map(formatOffer));
});

app.post("/offer/:issueId", authMiddleware, (req: any, res) => {
  const issueId = parseInt(req.params.issueId);
  const issue = issues.find(i => i.issueId === issueId || i.id === issueId);
  if (!issue) return res.status(404).json({ message: "Issue not found" });

  const { price, estTime, preferedDate, description, offeredByWorkshopId } = req.body;
  const workshop = workshops.find(w => w.id === parseInt(offeredByWorkshopId));

  const newOffer: Offer = {
    offerId: nextOfferId,
    id: nextOfferId++,
    price: Number(price) || 0,
    estTime: estTime || "1 dzień",
    preferedDate: preferedDate || new Date().toISOString().split("T")[0],
    description: description || "",
    offeredByUser: req.user.username,
    offeredByWorkshopId: parseInt(offeredByWorkshopId),
    workshop: workshop || workshops[0],
    issue: { issueId: issue.issueId, title: issue.title, issueLeader: issue.issueLeader },
    created_At: new Date().toISOString()
  };

  offers.push(newOffer);
  if (!issue.offers) issue.offers = [];
  issue.offers.push(newOffer);

  res.status(201).json(formatOffer(newOffer));
});

app.post("/offer/accept/:id", authMiddleware, (req, res) => {
  const offerId = parseInt(req.params.id);
  const offer = offers.find(o => o.offerId === offerId || o.id === offerId);
  if (!offer) return res.status(404).json({ message: "Offer not found" });

  const issue = issues.find(i => i.offers && i.offers.some(o => o.offerId === offerId || o.id === offerId));
  if (issue) {
    issue.acceptedOffer = offer;
    issue.status = "IN PROGRESS";
  }
  res.json({ message: "Offer accepted successfully", issue: issue ? formatIssue(issue) : null });
});

app.delete("/offer/:id", authMiddleware, (req, res) => {
  const offerId = parseInt(req.params.id);
  const index = offers.findIndex(o => o.offerId === offerId || o.id === offerId);
  if (index !== -1) {
    offers.splice(index, 1);
  }
  issues.forEach(i => {
    if (i.offers) {
      i.offers = i.offers.filter(o => o.offerId !== offerId && o.id !== offerId);
    }
  });
  res.json({ message: `Offer ${offerId} was deleted` });
});

// ==================== OPINION ROUTES ====================

app.get("/opinion/getAll/:workshopId", (req, res) => {
  const workshopId = parseInt(req.params.workshopId);
  const workshopOpinions = opinions.filter(
    o => o.workshop && o.workshop.id === workshopId && !o.banned
  );
  res.json(workshopOpinions.map(formatOpinion));
});

app.post("/opinion/add/:workshopId", authMiddleware, (req: any, res) => {
  const workshopId = parseInt(req.params.workshopId);
  const workshop = workshops.find(w => w.id === workshopId);
  if (!workshop) return res.status(404).json({ message: "Workshop not found" });

  const { score, description, opinionedByIssueId, rate } = req.body;
  const user = users.find(u => u.username === req.user.username);
  const finalScore = Number(rate) || Number(score) || 5;

  const newOpinion: Opinion = {
    opinionId: nextOpinionId,
    id: nextOpinionId++,
    score: finalScore,
    description: description || "",
    opinionedByIssueId: parseInt(opinionedByIssueId) || 0,
    reported: false,
    banned: false,
    creationDate: new Date().toISOString().split("T")[0],
    user: { id: user?.id || 0, username: req.user.username, fullName: user?.fullName || "" },
    workshop: { id: workshop.id, name: workshop.name, owner: workshop.owner }
  };

  opinions.push(newOpinion);

  // Mark issue as opinioned
  if (opinionedByIssueId) {
    const issue = issues.find(i => i.issueId === parseInt(opinionedByIssueId) || i.id === parseInt(opinionedByIssueId));
    if (issue) issue.opinioned = true;
  }

  res.status(201).json(formatOpinion(newOpinion));
});

// ==================== VITE SPA / STATIC SERVER ====================

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cars Mechanic Server running on port ${PORT}`);
  });
}

start();
