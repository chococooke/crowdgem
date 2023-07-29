import { Shield, Zap } from "react-feather";
import "../css/home.css"

const Home = () => {
    return (
        <>
            <header className="home__header">
                <h1>CrowdGem</h1>
                <p>Decentralized Crowdfunding Platform</p>
            </header>

            <div className="home__hero-section">
                <h1>Support Projects You Believe In</h1>
                <p>With CrowdGem, you can be part of the future. Discover and fund innovative projects directly from the community.</p>
                <a href="/app" className="cta-button">Get Started</a>
            </div>

            <div className="home__features-section">
                <h2>Why Choose CrowdGem?</h2>
                <p>Discover the benefits of using our decentralized crowdfunding platform:</p>
                <ul className="home__features-section-list">
                    <li className="home__feature"><span><Shield /></span>Transparent and Secure Crowdfunding</li>
                    <li className="home__feature"><span><Zap /></span>Efficient and Instant Transactions</li>
                </ul>
            </div>

            <footer className="home__footer">
                <p>&copy; 2023 CrowdGem. All rights reserved.</p>
            </footer>
        </>
    )
}

export default Home;