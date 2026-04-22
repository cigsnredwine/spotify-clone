import { Button } from "./button";
import { Link } from "react-router-dom";

const SignInOAuthButtons = () => {
    return (
        <div className="flex items-center gap-2">
            <Link to="/login">
                <Button variant={"secondary"} className="text-white border-zinc-200 h-11">
                    Sign In
                </Button>
            </Link>
            <Link to="/signup">
                <Button className="h-11">
                    Create Account
                </Button>
            </Link>
        </div>
    )
};

export default SignInOAuthButtons
