import { MultiStepForm } from "@/components/multi-step-form";

export default function CreatePage() {
    return (
        <div
            className="min-h-screen w-full flex items-center justify-center px-4 bg-cover bg-center"
            style={{
                backgroundImage:
                    "url('./redwood-background.jpg')",
            }}
        >
            <div className="w-full max-w-7xl">
                <MultiStepForm />
            </div>
        </div>
    );
}
