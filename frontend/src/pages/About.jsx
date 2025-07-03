import { Brain, Heart, BarChart3, Shield, Globe, ArrowRight } from "lucide-react"

const About = () => {
  const features = [
    {
      icon: Brain,
      title: "Machine Learning Predictions",
      description:
        "Advanced AI algorithms analyze product data, environmental conditions, and historical patterns to predict spoilage with 95% accuracy.",
      tech: "TensorFlow, Scikit-Learn",
    },
    {
      icon: Heart,
      title: "Smart Donation Matching",
      description:
        "Automatically connects surplus food with local NGOs and food banks, optimizing logistics and maximizing community impact.",
      tech: "Google Maps API, Real-time Matching",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description:
        "Comprehensive dashboards track waste reduction, cost savings, and environmental impact with interactive visualizations.",
      tech: "React, D3.js, Real-time Data",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description:
        "Natural Language Processing analyzes customer feedback to identify quality issues and improve prediction accuracy.",
      tech: "Hugging Face Transformers, NLP",
    },
  ]

  const workflow = [
    {
      step: 1,
      title: "Data Collection",
      description: "Gather product information, environmental data, and customer feedback",
    },
    {
      step: 2,
      title: "AI Analysis",
      description: "Machine learning models predict spoilage risk and optimal actions",
    },
    {
      step: 3,
      title: "Smart Alerts",
      description: "Proactive notifications suggest discounts, donations, or restocking",
    },
    {
      step: 4,
      title: "Action & Impact",
      description: "Execute recommendations and track sustainability metrics",
    },
  ]

  const techStack = [
    { category: "Frontend", technologies: ["React", "JavaScript", "Tailwind CSS"] },
    { category: "Backend", technologies: ["Node.js", "Express", "MongoDB"] },
    { category: "AI/ML", technologies: ["TensorFlow", "Scikit-Learn", "Python"] },
    { category: "Database", technologies: ["MongoDB", "PostgreSQL", "Redis"] },
    { category: "APIs", technologies: ["Google Maps", "Weather APIs", "SMS/Email"] },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              How FreshTrack Works
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the technology and methodology behind our AI-powered food waste reduction platform
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Technologies</h2>
            <p className="text-xl text-gray-600">Advanced AI and machine learning at the heart of sustainability</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-green-100 to-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-3">{feature.description}</p>
                    <div className="bg-white px-3 py-1 rounded-full text-sm text-blue-600 font-medium inline-block">
                      {feature.tech}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">From data to impact in four intelligent steps</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {workflow.map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-green-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                {index < workflow.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-gray-400 mx-auto mt-6 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Technology Stack</h2>
            <p className="text-xl text-gray-600">Built with modern, scalable technologies</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {techStack.map((stack, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{stack.category}</h3>
                <div className="space-y-2">
                  {stack.technologies.map((tech, techIndex) => (
                    <div key={techIndex} className="bg-white px-3 py-2 rounded-lg text-sm text-gray-700">
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Globe className="h-16 w-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl font-bold mb-6">Global Impact Potential</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-4xl font-bold mb-2">1.3B</div>
              <div className="text-lg opacity-90">Tons of food wasted globally per year</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$1T</div>
              <div className="text-lg opacity-90">Economic value of food waste annually</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">8%</div>
              <div className="text-lg opacity-90">Of global greenhouse gas emissions</div>
            </div>
          </div>
          <p className="text-xl mt-8 opacity-90 max-w-3xl mx-auto">
            FreshTrack addresses one of the world's most pressing sustainability challenges, turning waste into
            opportunity and creating positive impact for communities worldwide.
          </p>
        </div>
      </section>
    </div>
  )
}

export default About
