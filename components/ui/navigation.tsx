import link from "next/link";
export default function Navigation() {
    return(
        <nav className="bg-green-700 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-lg font-bold">
                    Agri Tracker
                </div>
            </div>
        </nav>
    )
}