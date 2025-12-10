import { useNavigate } from "react-router-dom";
import { TherapistDemo } from "./inwards-components/TherapistDemo";

export default function TherapistDemoPage() {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-[100] bg-white overflow-auto">
            <TherapistDemo onBack={() => navigate('/work/design/inwards')} />
        </div>
    );
}
