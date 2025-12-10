import { useNavigate } from "react-router-dom";
import { MobileDemo } from "./inwards-components/MobileDemo";

export default function UserDemoPage() {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-[100] bg-white overflow-auto">
            <MobileDemo onBack={() => navigate('/work/design/inwards')} />
        </div>
    );
}
