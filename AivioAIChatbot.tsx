import React, { useState, useEffect, useRef } from 'react'
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  Settings, 
  Moon, 
  Sun,
  ThumbsUp,
  Heart,
  Copy,
  Share2,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  Rocket,
  Sparkles,
  Bot,
  User,
  Zap,
  TrendingUp,
  HelpCircle,
  ArrowRight,
  Star,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  Lightbulb,
  Target
} from 'lucide-react'

// ===== TYPES & INTERFACES =====
interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  type: 'text' | 'image' | 'file'
  metadata?: {
    confidence?: number
    category?: string
    tools?: string[]
  }
}

interface QuickReply {
  id: string
  text: string
  action: string
  category?: string
}

interface UserStats {
  totalInteractions: number
  toolsRecommended: number
  questionsAnswered: number
  trendsShared: number
}

interface NotificationItem {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  priority: 'low' | 'medium' | 'high'
  read?: boolean
}

interface AITool {
  id: string
  name: string
  description: string
  category: string
  pricing: string
  rating: number
  users: string
  useCase: string[]
  trending?: boolean
  pros?: string[]
  cons?: string[]
  website?: string
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  keywords: string[]
  popularity: number
  relatedQuestions?: string[]
}

interface TrendInsight {
  id: string
  title: string
  description: string
  category: string
  growth: number
  impact: 'Low' | 'Medium' | 'High'
  confidence: number
  timestamp: Date
}

// ===== DATA =====
const aiTools: AITool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'Advanced conversational AI for writing, coding, analysis, and creative tasks',
    category: 'Conversational AI',
    pricing: 'Free / $20/month',
    rating: 4.8,
    users: '100M+',
    useCase: ['Writing', 'Coding', 'Research', 'Analysis'],
    trending: true,
    pros: ['Versatile', 'High-quality outputs', 'Large knowledge base'],
    cons: ['Can hallucinate', 'Knowledge cutoff'],
    website: 'https://chat.openai.com'
  },
  {
    id: '2',
    name: 'Midjourney',
    description: 'AI-powered image generation tool for creating stunning artwork and designs',
    category: 'Image Generation',
    pricing: '$10-60/month',
    rating: 4.7,
    users: '15M+',
    useCase: ['Art Creation', 'Design', 'Marketing', 'Concept Art'],
    trending: true,
    pros: ['High-quality images', 'Artistic style', 'Active community'],
    cons: ['Discord-based', 'Limited free usage'],
    website: 'https://midjourney.com'
  },
  {
    id: '3',
    name: 'Claude',
    description: 'Constitutional AI assistant for helpful, harmless, and honest conversations',
    category: 'Conversational AI',
    pricing: 'Free / $20/month',
    rating: 4.6,
    users: '5M+',
    useCase: ['Writing', 'Analysis', 'Coding', 'Research'],
    pros: ['Safety-focused', 'Long context', 'Thoughtful responses'],
    cons: ['Newer platform', 'More conservative'],
    website: 'https://claude.ai'
  },
  {
    id: '4',
    name: 'DALL-E 3',
    description: 'OpenAI\'s advanced text-to-image model with precise prompt adherence',
    category: 'Image Generation',
    pricing: '$15-50/month',
    rating: 4.5,
    users: '10M+',
    useCase: ['Image Creation', 'Marketing', 'Content', 'Design'],
    pros: ['Prompt accuracy', 'High resolution', 'Safe outputs'],
    cons: ['Limited styles', 'Content restrictions'],
    website: 'https://openai.com/dall-e-3'
  },
  {
    id: '5',
    name: 'Synthesia',
    description: 'AI video generation platform for creating professional videos with virtual presenters',
    category: 'Video Generation',
    pricing: '$30-90/month',
    rating: 4.4,
    users: '2M+',
    useCase: ['Training Videos', 'Marketing', 'Education', 'Corporate Communication'],
    pros: ['Professional quality', 'Multiple languages', 'Custom avatars'],
    cons: ['Expensive', 'Limited expressions'],
    website: 'https://synthesia.io'
  },
  {
    id: '6',
    name: 'Copy.ai',
    description: 'AI-powered copywriting tool for marketing content and sales copy',
    category: 'Content Writing',
    pricing: 'Free / $36/month',
    rating: 4.3,
    users: '8M+',
    useCase: ['Marketing Copy', 'Social Media', 'Email', 'Blog Posts'],
    pros: ['Templates', 'Easy to use', 'Multiple formats'],
    cons: ['Generic output', 'Requires editing'],
    website: 'https://copy.ai'
  },
  {
    id: '7',
    name: 'Runway ML',
    description: 'Creative AI platform for video editing, generation, and image manipulation',
    category: 'Creative AI',
    pricing: 'Free / $12-76/month',
    rating: 4.5,
    users: '3M+',
    useCase: ['Video Editing', 'Image Generation', 'Creative Projects'],
    trending: true,
    pros: ['Innovative features', 'Creator-focused', 'Regular updates'],
    cons: ['Learning curve', 'Credit system'],
    website: 'https://runwayml.com'
  },
  {
    id: '8',
    name: 'Jasper',
    description: 'AI writing assistant optimized for business and marketing content',
    category: 'Content Writing',
    pricing: '$39-125/month',
    rating: 4.2,
    users: '1M+',
    useCase: ['Business Writing', 'Marketing', 'SEO Content', 'Social Media'],
    pros: ['Business-focused', 'SEO optimization', 'Team collaboration'],
    cons: ['Expensive', 'Similar to competitors'],
    website: 'https://jasper.ai'
  }
]

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I find the right AI tool for my needs?',
    answer: 'Start by defining your specific use case and requirements. Browse our categories, read reviews, and use our recommendation system. Consider factors like pricing, ease of use, and integration capabilities.',
    category: 'Getting Started',
    keywords: ['find', 'choose', 'select', 'right tool'],
    popularity: 95,
    relatedQuestions: ['What factors should I consider?', 'How do I compare tools?']
  },
  {
    id: '2',
    question: 'Are these AI tools free to use?',
    answer: 'Many AI tools offer free tiers with limited features, while others require paid subscriptions. We clearly indicate pricing for each tool - look for "Free", "Freemium", or specific pricing information.',
    category: 'Pricing',
    keywords: ['free', 'cost', 'pricing', 'money'],
    popularity: 88,
    relatedQuestions: ['What are the pricing models?', 'Any completely free tools?']
  },
  {
    id: '3',
    question: 'How do I get started with AIVIO?',
    answer: 'Welcome to AIVIO! Browse our tool categories, read detailed reviews, and use our search feature. You can also chat with me for personalized recommendations based on your specific needs.',
    category: 'Platform Guide',
    keywords: ['getting started', 'how to use', 'begin'],
    popularity: 82,
    relatedQuestions: ['What features are available?', 'How to navigate the site?']
  },
  {
    id: '4',
    question: 'Can I compare different AI tools?',
    answer: 'Yes! Use our comparison feature to evaluate tools side-by-side. Compare pricing, features, ratings, and use cases to make informed decisions.',
    category: 'Features',
    keywords: ['compare', 'comparison', 'versus'],
    popularity: 76,
    relatedQuestions: ['How to use comparison tool?', 'What can I compare?']
  },
  {
    id: '5',
    question: 'How often is the information updated?',
    answer: 'We update tool information, pricing, and reviews regularly. New tools are added weekly, and existing information is verified monthly to ensure accuracy.',
    category: 'Platform Info',
    keywords: ['updated', 'current', 'latest'],
    popularity: 64,
    relatedQuestions: ['How fresh is the data?', 'When was this last updated?']
  },
  {
    id: '6',
    question: 'Can I submit reviews for AI tools?',
    answer: 'Absolutely! User reviews help our community make better decisions. You can rate tools and share your experience to help others.',
    category: 'Community',
    keywords: ['review', 'rate', 'feedback'],
    popularity: 58,
    relatedQuestions: ['How to write a review?', 'Can I edit my review?']
  }
]

const trends: TrendInsight[] = [
  {
    id: '1',
    title: 'Multimodal AI Integration',
    description: 'AI systems combining text, image, audio, and video capabilities are becoming mainstream, enabling more sophisticated applications.',
    category: 'Technology',
    growth: 340,
    impact: 'High',
    confidence: 92,
    timestamp: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'AI Agent Automation',
    description: 'Autonomous AI agents capable of complex task execution are revolutionizing business processes and productivity workflows.',
    category: 'Business',
    growth: 280,
    impact: 'High',
    confidence: 88,
    timestamp: new Date('2024-01-14')
  },
  {
    id: '3',
    title: 'Edge AI Deployment',
    description: 'AI models running locally on devices for privacy, speed, and offline capabilities are gaining significant traction.',
    category: 'Technology',
    growth: 195,
    impact: 'Medium',
    confidence: 85,
    timestamp: new Date('2024-01-13')
  },
  {
    id: '4',
    title: 'AI-Powered Creative Tools',
    description: 'Creative industries seeing massive AI adoption for content generation, design, and artistic collaboration.',
    category: 'Creative',
    growth: 225,
    impact: 'High',
    confidence: 90,
    timestamp: new Date('2024-01-12')
  },
  {
    id: '5',
    title: 'Conversational Commerce',
    description: 'AI chatbots and virtual assistants driving e-commerce sales through personalized shopping experiences.',
    category: 'Commerce',
    growth: 156,
    impact: 'Medium',
    confidence: 82,
    timestamp: new Date('2024-01-11')
  }
]

// ===== COMPONENTS =====
const ChatMessageComponent: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isBot = message.sender === 'bot'
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.text)
  }

  const shareMessage = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AIVIO AI Assistant',
        text: message.text,
      })
    }
  }

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} group mb-4`}>
      <div className={`flex items-start space-x-2 max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isBot 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
            : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
        }`}>
          {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>
        
        {/* Message Bubble */}
        <div className={`rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm ${
          isBot
            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
        }`}>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.text}
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs mt-2 ${
            isBot ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          
          {/* Reaction Buttons */}
          {isBot && (
            <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Like this response"
              >
                <ThumbsUp className="w-3 h-3 text-gray-400 hover:text-blue-500" />
              </button>
              <button 
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Love this response"
              >
                <Heart className="w-3 h-3 text-gray-400 hover:text-red-500" />
              </button>
              <button 
                onClick={copyToClipboard}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-3 h-3 text-gray-400 hover:text-green-500" />
              </button>
              <button 
                onClick={shareMessage}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Share this response"
              >
                <Share2 className="w-3 h-3 text-gray-400 hover:text-purple-500" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const QuickActionsComponent: React.FC<{ onActionClick: (reply: QuickReply) => void, quickReplies: QuickReply[] }> = ({ onActionClick, quickReplies }) => {
  if (quickReplies.length === 0) return null

  return (
    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block w-full">
          Quick actions:
        </span>
        {quickReplies.map((reply) => (
          <button
            key={reply.id}
            onClick={() => onActionClick(reply)}
            className="inline-flex items-center space-x-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 hover:from-blue-200 hover:to-purple-200 dark:hover:from-blue-800 dark:hover:to-purple-800 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
          >
            <span>{reply.text}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ===== MAIN COMPONENT =====
interface AivioAIChatbotProps {
  theme?: 'light' | 'dark' | 'auto'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  customStyles?: React.CSSProperties
}

const AivioAIChatbot: React.FC<AivioAIChatbotProps> = ({
  theme = 'auto',
  position = 'bottom-right',
  customStyles
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [userStats, setUserStats] = useState<UserStats>({
    totalInteractions: 0,
    toolsRecommended: 0,
    questionsAnswered: 0,
    trendsShared: 0
  })
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  }

  // Initialize chatbot
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      text: "👋 Welcome to AIVIO! I'm your AI assistant here to help you discover the perfect AI tools, navigate our platform, and stay updated with the latest AI trends. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
    setMessages([welcomeMessage])
    
    // Set initial quick replies
    setQuickReplies([
      { id: '1', text: '🔍 Find AI Tools', action: 'recommend_tools' },
      { id: '2', text: '📈 Latest Trends', action: 'show_trends' },
      { id: '3', text: '❓ How to Use AIVIO', action: 'site_guide' },
      { id: '4', text: '💡 Popular Tools', action: 'popular_tools' }
    ])

    // Add initial notification
    const notification: NotificationItem = {
      id: '1',
      message: 'New AI trends available!',
      type: 'info',
      timestamp: new Date(),
      priority: 'medium'
    }
    setNotifications([notification])
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Theme handling
  useEffect(() => {
    if (theme === 'auto') {
      const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(darkMode)
    } else {
      setIsDarkMode(theme === 'dark')
    }
  }, [theme])

  // Message processing function
  const processMessage = (userInput: string) => {
    const input = userInput.toLowerCase().trim()
    
    // AI Tool Recommendations
    if (input.includes('recommend') || input.includes('tool') || input.includes('ai') || input.includes('find')) {
      return handleToolRecommendation(input)
    }
    
    // FAQ and Site Guide
    if (input.includes('how') || input.includes('help') || input.includes('guide') || input.includes('use')) {
      return handleFAQ(input)
    }
    
    // Trending Insights
    if (input.includes('trend') || input.includes('latest') || input.includes('new') || input.includes('popular')) {
      return handleTrends(input)
    }
    
    // Default response
    return "I can help you with:\n🤖 **AI Tool Recommendations** - Find the perfect tools for your needs\n📚 **Site Navigation** - Learn how to use AIVIO effectively\n📈 **Trending Insights** - Stay updated with AI market trends\n\nWhat would you like to explore?"
  }

  const handleToolRecommendation = (input: string) => {
    const matchingTools = aiTools.filter(tool => 
      tool.category.toLowerCase().includes(input) ||
      tool.name.toLowerCase().includes(input) ||
      tool.description.toLowerCase().includes(input) ||
      tool.useCase.some(use => use.toLowerCase().includes(input))
    ).slice(0, 3)

    if (matchingTools.length > 0) {
      setUserStats(prev => ({ ...prev, toolsRecommended: prev.toolsRecommended + matchingTools.length }))
      
      return `Here are my top recommendations for you:\n\n${matchingTools.map((tool, index) => 
        `**${index + 1}. ${tool.name}** ${tool.trending ? '🔥' : ''}\n` +
        `${tool.description}\n` +
        `💰 ${tool.pricing} | ⭐ ${tool.rating}/5 | 👥 ${tool.users}\n` +
        `🎯 Best for: ${tool.useCase.join(', ')}\n` +
        `${tool.pros ? `✅ Pros: ${tool.pros.join(', ')}\n` : ''}` +
        `${tool.cons ? `❌ Cons: ${tool.cons.join(', ')}\n` : ''}\n`
      ).join('\n')}`
    }
    
    return "I'd love to help you find the perfect AI tool! Could you tell me more about what you're looking for? For example:\n• Content creation\n• Image generation\n• Data analysis\n• Customer support\n• Marketing automation"
  }

  const handleFAQ = (input: string) => {
    const matchingFAQs = faqs.filter(faq => 
      faq.question.toLowerCase().includes(input) ||
      faq.answer.toLowerCase().includes(input) ||
      faq.keywords.some(keyword => input.includes(keyword))
    ).slice(0, 2)

    if (matchingFAQs.length > 0) {
      setUserStats(prev => ({ ...prev, questionsAnswered: prev.questionsAnswered + 1 }))
      
      return matchingFAQs.map(faq => 
        `**${faq.question}**\n${faq.answer}\n${faq.relatedQuestions ? `\n*Related: ${faq.relatedQuestions.join(', ')}*` : ''}`
      ).join('\n\n')
    }
    
    return "Here's how you can get the most out of AIVIO:\n\n🔍 **Discover Tools**: Browse our curated collection of AI tools\n📊 **Compare Options**: See detailed comparisons and reviews\n💡 **Get Recommendations**: Let me suggest tools based on your needs\n🎯 **Stay Updated**: Follow the latest AI trends and releases\n\nWhat specific area would you like help with?"
  }

  const handleTrends = (input: string) => {
    const relevantTrends = trends.filter(trend => 
      trend.title.toLowerCase().includes(input) ||
      trend.description.toLowerCase().includes(input) ||
      trend.category.toLowerCase().includes(input)
    ).slice(0, 3)

    if (relevantTrends.length > 0) {
      setUserStats(prev => ({ ...prev, trendsShared: prev.trendsShared + relevantTrends.length }))
      
      return `🔥 **Latest AI Trends & Insights:**\n\n${relevantTrends.map((trend, index) => 
        `**${index + 1}. ${trend.title}** ${trend.growth > 0 ? '📈' : '📉'}\n` +
        `${trend.description}\n` +
        `📊 Growth: ${trend.growth > 0 ? '+' : ''}${trend.growth}% | 🎯 Impact: ${trend.impact}\n` +
        `🏷️ Category: ${trend.category} | 🔮 Confidence: ${trend.confidence}%\n\n`
      ).join('')}`
    }
    
    return "🚀 **Current AI Trends:**\n\n📈 **Generative AI Boom** - 250% growth in adoption\n🤖 **AI Agents** - Autonomous AI systems gaining traction\n🎨 **Creative AI** - Revolutionary tools for content creation\n💼 **Enterprise AI** - Business process automation surge\n\nWhich trend interests you most?"
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    setUserStats(prev => ({ ...prev, totalInteractions: prev.totalInteractions + 1 }))

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: processMessage(input),
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
      
      // Update quick replies based on response
      updateQuickReplies(input)
      
      // Play notification sound
      if (soundEnabled) {
        playNotificationSound()
      }
    }, 1500)
  }

  const updateQuickReplies = (userInput: string) => {
    const input = userInput.toLowerCase()
    
    if (input.includes('tool') || input.includes('recommend')) {
      setQuickReplies([
        { id: '1', text: '🎨 Creative Tools', action: 'creative_tools' },
        { id: '2', text: '💼 Business Tools', action: 'business_tools' },
        { id: '3', text: '📊 Analytics Tools', action: 'analytics_tools' },
        { id: '4', text: '🔍 More Options', action: 'show_all_tools' }
      ])
    } else if (input.includes('trend')) {
      setQuickReplies([
        { id: '1', text: '🤖 AI Development', action: 'ai_dev_trends' },
        { id: '2', text: '💼 Business Impact', action: 'business_trends' },
        { id: '3', text: '🎨 Creative AI', action: 'creative_trends' },
        { id: '4', text: '📈 Market Analysis', action: 'market_trends' }
      ])
    } else {
      setQuickReplies([
        { id: '1', text: '🔍 Find Tools', action: 'recommend_tools' },
        { id: '2', text: '📈 Trends', action: 'show_trends' },
        { id: '3', text: '❓ Help', action: 'site_guide' },
        { id: '4', text: '⭐ Popular', action: 'popular_tools' }
      ])
    }
  }

  const handleQuickReply = (reply: QuickReply) => {
    setInput(reply.text.replace(/[🔍📈❓⭐🎨💼📊🤖]/g, '').trim())
    setTimeout(() => handleSendMessage(), 100)
  }

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (e) {
      // Fallback for browsers that don't support Web Audio API
      console.log('Audio not supported')
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Voice recording implementation would go here
  }

  const chatWindowClass = `
    ${isDarkMode ? 'dark' : ''} 
    fixed ${positionClasses[position]} 
    ${isExpanded ? 'w-[500px] h-[700px]' : 'w-96 h-[500px]'} 
    transition-all duration-300 ease-in-out 
    z-50
  `

  return (
    <>
      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .aivio-chatbot * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        .aivio-chatbot ::-webkit-scrollbar {
          width: 6px;
        }
        
        .aivio-chatbot ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .aivio-chatbot ::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        
        .aivio-chatbot ::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }
        
        .aivio-chatbot.dark ::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
        }
        
        .aivio-chatbot.dark ::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.8);
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-typing-bounce {
          animation: typing-bounce 1.4s infinite ease-in-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        
        .dark .glass-effect {
          background: rgba(17, 24, 39, 0.25);
          border: 1px solid rgba(75, 85, 99, 0.18);
        }
      `}</style>

      <div className="aivio-chatbot">
        {/* Floating Action Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className={`fixed ${positionClasses[position]} w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 group animate-float`}
            style={customStyles}
          >
            <div className="relative">
              <Rocket className="w-6 h-6 mx-auto" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </div>
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Chat with AIVIO AI
            </div>
          </button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div className={chatWindowClass} style={customStyles}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95 border border-gray-200 dark:border-gray-700 h-full flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-2xl text-white animate-gradient">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur glass-effect">
                        <Bot className="w-6 h-6" />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">AIVIO AI Assistant</h3>
                      <p className="text-sm text-blue-100 flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        Online • Ready to help
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Stats Badge */}
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur glass-effect">
                      {userStats.totalInteractions} chats
                    </div>
                    
                    {/* Control Buttons */}
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                      title={isExpanded ? 'Minimize' : 'Expand'}
                    >
                      {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                      title="Toggle theme"
                    >
                      {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                      title="Toggle sound"
                    >
                      {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                      title="Close chat"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Stats Bar */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white bg-opacity-20 rounded-lg p-2 backdrop-blur glass-effect">
                    <div className="text-lg font-bold">{userStats.toolsRecommended}</div>
                    <div className="text-xs text-blue-100">Tools Suggested</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-2 backdrop-blur glass-effect">
                    <div className="text-lg font-bold">{userStats.questionsAnswered}</div>
                    <div className="text-xs text-blue-100">Questions Answered</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-2 backdrop-blur glass-effect">
                    <div className="text-lg font-bold">{userStats.trendsShared}</div>
                    <div className="text-xs text-blue-100">Trends Shared</div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                {messages.map((message) => (
                  <ChatMessageComponent key={message.id} message={message} />
                ))}
                
                {isTyping && (
                  <div className="flex items-center space-x-2 text-gray-500 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <QuickActionsComponent onActionClick={handleQuickReply} quickReplies={quickReplies} />

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask me about AI tools, trends, or how to use AIVIO..."
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    />
                    <button
                      onClick={toggleRecording}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
                        isRecording 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                      title="Voice input"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-3 rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    title="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Suggestion Pills */}
                {input.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                      Press Enter to send
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AivioAIChatbot
