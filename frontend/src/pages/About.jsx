import { Brain, Heart, BarChart3, Shield, Users, Globe, Award, Zap } from "lucide-react"

const About = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Predictions",
      description:
        "Advanced machine learning algorithms analyze multiple factors to predict spoilage with 95% accuracy, helping you make informed decisions about your inventory.",
    },
    {
      icon: Heart,
      title: "Smart Donation Matching",
      description:
        "Automatically connect surplus food with local NGOs and food banks, ensuring nothing goes to waste while helping communities in need.",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description:
        "Comprehensive dashboards track waste reduction, cost savings, and environmental impact with detailed insights and trends.",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description:
        "NLP analysis of customer feedback ensures food quality standards are maintained while identifying potential issues early.",
    },
    {
      icon: Users,
      title: "Community Impact",
      description:
        "Connect with local organizations to maximize social impact and build stronger community relationships through food donations.",
    },
    {
      icon: Globe,
      title: "Environmental Benefits",
      description:
        "Reduce carbon footprint and environmental impact by minimizing food waste and optimizing supply chain efficiency.",
    },
  ]

  const stats = [
    { number: "95%", label: "Prediction Accuracy", description: "ML model accuracy in spoilage prediction" },
    { number: "40%", label: "Waste Reduction", description: "Average reduction in food waste" },
    { number: "500+", label: "Retailers", description: "Stores using FreshTrack globally" },
    { number: "2.5M", label: "Meals Donated", description: "Community meals facilitated" },
  ]

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "CEO & Co-founder",
      bio: "Former Google AI researcher with 10+ years in machine learning and sustainability tech.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-founder",
      bio: "Ex-Amazon engineer specializing in scalable systems and retail technology solutions.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Dr. Priya Patel",
      role: "Head of Data Science",
      bio: "PhD in Computer Science with expertise in predictive analytics and food science.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "James Thompson",
      role: "Head of Partnerships",
      bio: "15+ years in retail operations and NGO partnerships, driving social impact initiatives.",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Revolutionizing Food Waste Management
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              FreshTrack combines cutting-edge AI technology with social impact to create a sustainable future where no
              food goes to waste and every community is fed.
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <Award className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">UN SDG Award Winner</p>
              </div>
              <div className="text-center">
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">TechCrunch Disrupt Finalist</p>
              </div>
              <div className="text-center">
                <Globe className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Global Impact Leader</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that technology can solve one of the world's most pressing problems: food waste. Every year,
                1.3 billion tons of food is wasted globally while 828 million people go hungry.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                FreshTrack bridges this gap by using artificial intelligence to predict food spoilage, optimize
                inventory management, and connect surplus food with those who need it most.
              </p>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Our Vision</h3>
                <p className="text-green-700">
                  A world where advanced technology ensures no food goes to waste, every community has access to fresh
                  nutrition, and retailers operate with maximum efficiency and sustainability.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                  <div className="text-sm font-medium text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-600">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How FreshTrack Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform combines multiple technologies to deliver unprecedented accuracy and impact in
              food waste management.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-gradient-to-br from-green-100 to-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our diverse team of experts combines deep technical knowledge with passion for social impact and
              sustainability.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-48 h-48 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-green-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Global Impact</h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90">
            Together with our partners, we're creating measurable change in communities worldwide.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 p-8 rounded-xl">
              <div className="text-4xl font-bold mb-2">15,000 tons</div>
              <div className="text-lg opacity-90">Food waste prevented</div>
            </div>
            <div className="bg-white bg-opacity-10 p-8 rounded-xl">
              <div className="text-4xl font-bold mb-2">$12M</div>
              <div className="text-lg opacity-90">Cost savings generated</div>
            </div>
            <div className="bg-white bg-opacity-10 p-8 rounded-xl">
              <div className="text-4xl font-bold mb-2">250+</div>
              <div className="text-lg opacity-90">NGO partnerships</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Join hundreds of retailers who are already reducing waste, saving money, and making a positive impact on
            their communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Get Started Today
            </a>
            <a
              href="/dashboard"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Try Demo
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
