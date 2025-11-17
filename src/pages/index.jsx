import Layout from "./Layout.jsx";

import Home from "./Home";

import EventDetails from "./EventDetails";

import MyTickets from "./MyTickets";

import OrganizerDashboard from "./OrganizerDashboard";

import CreateEvent from "./CreateEvent";

import Support from "./Support";

import Notifications from "./Notifications";

import ValidateTicket from "./ValidateTicket";

import SaibaMais from "./SaibaMais";

import PoliticaCookies from "./PoliticaCookies";

import PoliticaPrivacidade from "./PoliticaPrivacidade";

import TermosUso from "./TermosUso";

import PoliticaReembolso from "./PoliticaReembolso";

import UserSettings from "./UserSettings";

import CategoryManagement from "./CategoryManagement";

import ComoComprarIngressos from "./ComoComprarIngressos";

import OndeVerMeusIngressos from "./OndeVerMeusIngressos";

import ComoSolicitarReembolso from "./ComoSolicitarReembolso";

import ComoCriarEvento from "./ComoCriarEvento";

import Onboarding from "./Onboarding";

import BankAccountSetup from "./BankAccountSetup";

import FinancialDashboard from "./FinancialDashboard";

import RequestRefund from "./RequestRefund";

import Checkout from "./Checkout";

import PaymentConfirmation from "./PaymentConfirmation";

import AdminBankSetup from "./AdminBankSetup";

import WebhookTest from "./WebhookTest";

import SecurityDocs from "./SecurityDocs";

import AdminPanel from "./AdminPanel";

import AdminUsers from "./AdminUsers";

import AdminEvents from "./AdminEvents";

import AdminReports from "./AdminReports";

import AdminRefunds from "./AdminRefunds";

import Playlists from "./Playlists";

import AdminSupport from "./AdminSupport";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    EventDetails: EventDetails,
    
    MyTickets: MyTickets,
    
    OrganizerDashboard: OrganizerDashboard,
    
    CreateEvent: CreateEvent,
    
    Support: Support,
    
    Notifications: Notifications,
    
    ValidateTicket: ValidateTicket,
    
    SaibaMais: SaibaMais,
    
    PoliticaCookies: PoliticaCookies,
    
    PoliticaPrivacidade: PoliticaPrivacidade,
    
    TermosUso: TermosUso,
    
    PoliticaReembolso: PoliticaReembolso,
    
    UserSettings: UserSettings,
    
    CategoryManagement: CategoryManagement,
    
    ComoComprarIngressos: ComoComprarIngressos,
    
    OndeVerMeusIngressos: OndeVerMeusIngressos,
    
    ComoSolicitarReembolso: ComoSolicitarReembolso,
    
    ComoCriarEvento: ComoCriarEvento,
    
    Onboarding: Onboarding,
    
    BankAccountSetup: BankAccountSetup,
    
    FinancialDashboard: FinancialDashboard,
    
    RequestRefund: RequestRefund,
    
    Checkout: Checkout,
    
    PaymentConfirmation: PaymentConfirmation,
    
    AdminBankSetup: AdminBankSetup,
    
    WebhookTest: WebhookTest,
    
    SecurityDocs: SecurityDocs,
    
    AdminPanel: AdminPanel,
    
    AdminUsers: AdminUsers,
    
    AdminEvents: AdminEvents,
    
    AdminReports: AdminReports,
    
    AdminRefunds: AdminRefunds,
    
    Playlists: Playlists,
    
    AdminSupport: AdminSupport,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/EventDetails" element={<EventDetails />} />
                
                <Route path="/MyTickets" element={<MyTickets />} />
                
                <Route path="/OrganizerDashboard" element={<OrganizerDashboard />} />
                
                <Route path="/CreateEvent" element={<CreateEvent />} />
                
                <Route path="/Support" element={<Support />} />
                
                <Route path="/Notifications" element={<Notifications />} />
                
                <Route path="/ValidateTicket" element={<ValidateTicket />} />
                
                <Route path="/SaibaMais" element={<SaibaMais />} />
                
                <Route path="/PoliticaCookies" element={<PoliticaCookies />} />
                
                <Route path="/PoliticaPrivacidade" element={<PoliticaPrivacidade />} />
                
                <Route path="/TermosUso" element={<TermosUso />} />
                
                <Route path="/PoliticaReembolso" element={<PoliticaReembolso />} />
                
                <Route path="/UserSettings" element={<UserSettings />} />
                
                <Route path="/CategoryManagement" element={<CategoryManagement />} />
                
                <Route path="/ComoComprarIngressos" element={<ComoComprarIngressos />} />
                
                <Route path="/OndeVerMeusIngressos" element={<OndeVerMeusIngressos />} />
                
                <Route path="/ComoSolicitarReembolso" element={<ComoSolicitarReembolso />} />
                
                <Route path="/ComoCriarEvento" element={<ComoCriarEvento />} />
                
                <Route path="/Onboarding" element={<Onboarding />} />
                
                <Route path="/BankAccountSetup" element={<BankAccountSetup />} />
                
                <Route path="/FinancialDashboard" element={<FinancialDashboard />} />
                
                <Route path="/RequestRefund" element={<RequestRefund />} />
                
                <Route path="/Checkout" element={<Checkout />} />
                
                <Route path="/PaymentConfirmation" element={<PaymentConfirmation />} />
                
                <Route path="/AdminBankSetup" element={<AdminBankSetup />} />
                
                <Route path="/WebhookTest" element={<WebhookTest />} />
                
                <Route path="/SecurityDocs" element={<SecurityDocs />} />
                
                <Route path="/AdminPanel" element={<AdminPanel />} />
                
                <Route path="/AdminUsers" element={<AdminUsers />} />
                
                <Route path="/AdminEvents" element={<AdminEvents />} />
                
                <Route path="/AdminReports" element={<AdminReports />} />
                
                <Route path="/AdminRefunds" element={<AdminRefunds />} />
                
                <Route path="/Playlists" element={<Playlists />} />
                
                <Route path="/AdminSupport" element={<AdminSupport />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}