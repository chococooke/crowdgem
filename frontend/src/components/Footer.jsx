import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <footer className="footer">
            <span className="footer-key">Dev : </span><Link className="footer-link" to={"https://github.com/chococooke"}>chococooke</Link>
        </footer>
    )
}

export default Footer;