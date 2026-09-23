// Arabic & English i18n module
const TRANSLATIONS = {
  ar: {
    // Brand & Header
    appName: "ميكانيكي سيارات",
    tagline: "نظام إدارة ورش صيانة السيارات وطلبات الإصلاح",
    yourIssues: "طلبات الصيانة الخاصة بك",
    workshopManagement: "إدارة الورشة",
    adminPanel: "لوحة التحكم للإدارة",
    signUp: "إنشاء حساب جديد",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    myProfile: "الملف الشخصي",
    language: "اللغة",
    switchLanguage: "English",

    // Landing Page
    landingTitle: "منصة صيانة وإصلاح المركبات",
    landingSubtitle: "أنشئ حسابك لإدارة ورشة صيانة السيارات الخاصة بك أو لإرسال بلاغات وطلبات إصلاح سيارتك واستقبال عروض الأسعار.",
    joinAsCustomer: "سجل كعميل / صاحب سيارة",
    joinAsWorkshop: "سجل كصاحب ورشة صيانة",

    // Auth
    fullName: "الاسم الكامل",
    username: "اسم المستخدم / البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    alreadyHaveAccount: "لديك حساب بالفعل؟ سجل دخولك",
    dontHaveAccount: "ليس لديك حساب؟ أنشئ حساباً جديداً",
    accountType: "نوع الحساب",
    accountCustomer: "عميل (طلب إصلاح وصيانة)",
    accountWorkshop: "صاحب ورشة صيانة",
    loginTitle: "تسجيل الدخول إلى حسابك",
    registerTitle: "إنشاء حساب جديد",
    submitLogin: "دخول",
    submitRegister: "إنشاء الحساب",

    // Dashboard & Issues
    dashboardTitle: "لوحة طلبات الصيانة",
    createIssue: "إنشاء طلب صيانة جديد",
    noIssuesFound: "لا توجد طلبات صيانة مسجلة حتى الآن",
    issueType: "نوع العطل",
    carModel: "موديل / نوع السيارة",
    description: "الوصف وتفاصيل العطل",
    localization: "المدينة / الموقع",
    startDate: "تاريخ البدء المتاح",
    endDate: "تاريخ الانتهاء المطلوب",
    status: "الحالة",
    createdAt: "تاريخ الإنشاء",
    options: "خيارات",
    issueBoard: "لوحة تفاصيل الطلب",
    updateIssue: "تعديل الطلب",
    deleteIssue: "حذف الطلب",
    rateWorkshop: "تقييم الورشة",
    save: "حفظ",
    cancel: "إلغاء",
    back: "رجوع",

    // Statuses
    statusToDo: "قيد الانتظار (TO DO)",
    statusInProgress: "قيد التنفيذ (IN PROGRESS)",
    statusDone: "تم الإصلاح (DONE)",

    // Issue Board & Offers
    issueDetails: "تفاصيل طلب الصيانة",
    issueAssignedTo: "تم إسناد الطلب إلى الورشة",
    noAcceptedOffer: "لم يتم قبول أي عرض صيانة لهذا الطلب حتى الآن",
    offersCount: "عروض الأسعار المقدمة",
    price: "السعر",
    estimatedTime: "الوقت المقدر للإصلاح",
    days: "أيام",
    preferredDate: "الموعد المقترح",
    acceptOffer: "قبول هذا العرض",
    declineOffer: "رفض العرض",
    changeStatusToDone: "تغيير الحالة إلى مكتمل (DONE)",
    addOffer: "تقديم عرض صيانة وسعر",
    owner: "المسؤول / المالك",
    phone: "رقم الهاتف",
    address: "العنوان",

    // Categories
    catDiagnostics: "فحص وتشخيص الأعطال",
    catEngine: "صيانة المحرك",
    catTransmission: "ناقل الحركة (الجير)",
    catSuspension: "نظام التعليق والمساعدات",
    catElectronics: "الكهرباء والإلكترونيات",
    catOther: "أعطال أخرى",
    allIssues: "جميع طلبات الصيانة المتاحة",

    // Workshop Dashboard
    myWorkshops: "ورش العمل التابعة لي",
    addWorkshop: "إضافة ورشة جديدة",
    workshopName: "اسم الورشة",
    workshopDescription: "نبذة عن الورشة والخدمات",
    offeredIssues: "الطلبات التي قدمت عليها عروضاً",
    reviews: "التقييمات والمراجعات",
    rating: "التقييم",
    writeReview: "أضف تقييمك للورشة",
    reportReview: "إبلاغ عن المراجعة",
    unreportReview: "إلغاء الإبلاغ",
    banReview: "حظر المراجعة",
    unbanReview: "إلغاء حظر المراجعة",

    // Admin Panel
    adminDashboard: "لوحة الإدارة العامة",
    usersList: "إدارة المستخدمين",
    acceptedWorkshops: "ورش العمل المعتمدة",
    pendingWorkshops: "ورش العمل قيد الاعتماد",
    reportedOpinions: "المراجعات المبلغ عنها",
    bannedOpinions: "المراجعات المحظورة",
    acceptWorkshop: "اعتماد الورشة",
    deleteWorkshop: "حذف الورشة",
    deleteUser: "حذف المستخدم",
    editUser: "تعديل بيانات المستخدم",
    roles: "الأدوار والصلاحيات",
    page: "صفحة",
    of: "من",

    // Common Alerts & Notes
    confirmDelete: "هل أنت متأكد من الحذف؟",
    successMsg: "تمت العملية بنجاح",
    loading: "جاري التحميل..."
  },
  en: {
    // Brand & Header
    appName: "Cars Mechanic",
    tagline: "Workshop Management System",
    yourIssues: "Your Issues",
    workshopManagement: "Workshop Management",
    adminPanel: "Admin Panel",
    signUp: "Sign Up",
    login: "Login",
    logout: "Logout",
    myProfile: "My Profile",
    language: "Language",
    switchLanguage: "العربية",

    // Landing Page
    landingTitle: "Vehicle Repairing Platform",
    landingSubtitle: "Create your account to manage your car repair workshop or submit repair requests and receive competitive offers.",
    joinAsCustomer: "Join as Car Owner",
    joinAsWorkshop: "Join as Workshop Owner",

    // Auth
    fullName: "Full Name",
    username: "Username / Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    alreadyHaveAccount: "Already have an account? Log in",
    dontHaveAccount: "Don't have an account? Sign up",
    accountType: "Account Type",
    accountCustomer: "Customer (Request repair)",
    accountWorkshop: "Workshop Owner",
    loginTitle: "Log In to Your Account",
    registerTitle: "Create New Account",
    submitLogin: "Login",
    submitRegister: "Sign Up",

    // Dashboard & Issues
    dashboardTitle: "Issues Dashboard",
    createIssue: "Create New Repair Issue",
    noIssuesFound: "No issues registered yet",
    issueType: "Issue Type",
    carModel: "Car Model",
    description: "Description",
    localization: "Location",
    startDate: "Available Start Date",
    endDate: "Target End Date",
    status: "Status",
    createdAt: "Created At",
    options: "Options",
    issueBoard: "Issue Board",
    updateIssue: "Update Issue Info",
    deleteIssue: "Delete Issue",
    rateWorkshop: "Rate Workshop",
    save: "Save",
    cancel: "Cancel",
    back: "Back",

    // Statuses
    statusToDo: "TO DO",
    statusInProgress: "IN PROGRESS",
    statusDone: "DONE",

    // Issue Board & Offers
    issueDetails: "Issue Details",
    issueAssignedTo: "Issue Assigned To",
    noAcceptedOffer: "This issue doesn't have any accepted offer yet",
    offersCount: "Submitted Offers",
    price: "Price",
    estimatedTime: "Estimated Repair Time",
    days: "days",
    preferredDate: "Proposed Date",
    acceptOffer: "Accept Offer",
    declineOffer: "Decline Offer",
    changeStatusToDone: "Change status to DONE",
    addOffer: "Submit Price Offer",
    owner: "Owner",
    phone: "Phone Number",
    address: "Address",

    // Categories
    catDiagnostics: "Diagnostics",
    catEngine: "Engine",
    catTransmission: "Transmission",
    catSuspension: "Suspension",
    catElectronics: "Electronics",
    catOther: "Other",
    allIssues: "All Issues",

    // Workshop Dashboard
    myWorkshops: "My Workshops",
    addWorkshop: "Add Workshop",
    workshopName: "Workshop Name",
    workshopDescription: "Description",
    offeredIssues: "My Submitted Offers",
    reviews: "Reviews",
    rating: "Rating",
    writeReview: "Write Review",
    reportReview: "Report Review",
    unreportReview: "Unreport",
    banReview: "Ban",
    unbanReview: "Unban",

    // Admin Panel
    adminDashboard: "Admin Dashboard",
    usersList: "Users Management",
    acceptedWorkshops: "Accepted Workshops",
    pendingWorkshops: "Pending Workshops",
    reportedOpinions: "Reported Reviews",
    bannedOpinions: "Banned Reviews",
    acceptWorkshop: "Accept Workshop",
    deleteWorkshop: "Delete Workshop",
    deleteUser: "Delete User",
    editUser: "Edit User",
    roles: "Roles",
    page: "Page",
    of: "of",

    // Common Alerts & Notes
    confirmDelete: "Are you sure you want to delete?",
    successMsg: "Operation completed successfully",
    loading: "Loading..."
  }
};

let currentLang = localStorage.getItem("app_lang") || "ar";

const listeners = new Set();

export function getLanguage() {
  return currentLang;
}

export function setLanguage(lang) {
  if (lang !== "ar" && lang !== "en") lang = "ar";
  currentLang = lang;
  localStorage.setItem("app_lang", lang);
  updateHtmlDirection(lang);
  listeners.forEach(fn => {
    try {
      fn(currentLang);
    } catch (e) {
      console.error(e);
    }
  });
}

export function toggleLanguage() {
  setLanguage(currentLang === "ar" ? "en" : "ar");
}

export function subscribeLanguage(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function t(key, fallback = "") {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.ar;
  if (dict[key] !== undefined) return dict[key];
  const enDict = TRANSLATIONS.en;
  if (enDict[key] !== undefined) return enDict[key];
  return fallback || key;
}

export function updateHtmlDirection(lang = currentLang) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    if (lang === "ar") {
      document.body.classList.add("arabic-layout");
    } else {
      document.body.classList.remove("arabic-layout");
    }
  }
}

// Initial setup
updateHtmlDirection(currentLang);
