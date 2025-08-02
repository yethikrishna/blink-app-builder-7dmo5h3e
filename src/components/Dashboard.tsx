import { useState, useEffect, useCallback } from 'react'
import { Home, Users, MessageCircle, Calendar, Heart, Plus, Search, Settings, Bell } from 'lucide-react'
import { kink } from '../kink/client'

interface UserProfile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  profile_photo: string
  interests: string
  connection_type: string
  location: string
}

type TabType = 'home' | 'communities' | 'chat' | 'events' | 'support'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUserProfile = useCallback(async () => {
    try {
      const currentUser = await kink.auth.me()
      setUser(currentUser)
      
      const profiles = await kink.db.user_profiles.list({
        where: { user_id: currentUser.id },
        limit: 1
      })
      
      if (profiles.length > 0) {
        setUserProfile(profiles[0])
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUserProfile()
  }, [loadUserProfile])

  useEffect(() => {
    const unsubscribe = kink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const renderHomeTab = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="kora-card p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            {userProfile?.profile_photo ? (
              <img 
                src={userProfile.profile_photo} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover" 
              />
            ) : (
              <span className="text-white font-medium">
                {userProfile?.first_name?.[0]}{userProfile?.last_name?.[0]}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-accent">
              Welcome back, {userProfile?.first_name}!
            </h2>
            <p className="text-muted-foreground text-sm">
              Ready to connect with your community?
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="kora-card p-4 text-left hover:shadow-md transition-shadow">
          <Plus className="w-6 h-6 text-primary mb-2" />
          <div className="font-medium text-accent">Find Groups</div>
          <div className="text-sm text-muted-foreground">Discover new communities</div>
        </button>
        
        <button className="kora-card p-4 text-left hover:shadow-md transition-shadow">
          <MessageCircle className="w-6 h-6 text-primary mb-2" />
          <div className="font-medium text-accent">Start Chat</div>
          <div className="text-sm text-muted-foreground">Connect one-on-one</div>
        </button>
        
        <button className="kora-card p-4 text-left hover:shadow-md transition-shadow">
          <Calendar className="w-6 h-6 text-primary mb-2" />
          <div className="font-medium text-accent">Create Event</div>
          <div className="text-sm text-muted-foreground">Plan an activity</div>
        </button>
        
        <button className="kora-card p-4 text-left hover:shadow-md transition-shadow">
          <Heart className="w-6 h-6 text-primary mb-2" />
          <div className="font-medium text-accent">Get Support</div>
          <div className="text-sm text-muted-foreground">Mental health resources</div>
        </button>
      </div>

      {/* Suggested Groups */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-accent">Suggested for You</h3>
          <button className="text-primary text-sm font-medium">See All</button>
        </div>
        
        <div className="space-y-3">
          {[
            {
              name: "Mums and Bubs Surrey Hills",
              members: 24,
              image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop",
              description: "Local mums connecting in Surrey Hills area"
            },
            {
              name: "Working Moms Support",
              members: 156,
              image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
              description: "Balancing career and motherhood together"
            },
            {
              name: "Gentle Parenting Circle",
              members: 89,
              image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
              description: "Supporting gentle parenting approaches"
            }
          ].map((group, index) => (
            <div key={index} className="kora-card p-4 hover:shadow-md transition-shadow">
              <div className="flex space-x-4">
                <img 
                  src={group.image} 
                  alt={group.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-accent">{group.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{group.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{group.members} members</span>
                    <button className="kora-button-secondary px-3 py-1 text-sm">Join</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCommunitiesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-accent">My Communities</h2>
        <button className="kora-button-primary px-4 py-2 text-sm">
          <Plus className="w-4 h-4 mr-2" />
          Join Group
        </button>
      </div>
      
      <div className="kora-card p-8 text-center">
        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-medium text-accent mb-2">No communities yet</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Join your first community to start connecting with other mothers
        </p>
        <button className="kora-button-primary px-6 py-2">Explore Communities</button>
      </div>
    </div>
  )

  const renderChatTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-accent">Messages</h2>
        <button className="p-2 rounded-full hover:bg-muted">
          <Search className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
      
      <div className="kora-card p-8 text-center">
        <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-medium text-accent mb-2">No messages yet</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Start a conversation with someone from your communities
        </p>
        <button className="kora-button-primary px-6 py-2">Find People to Chat</button>
      </div>
    </div>
  )

  const renderEventsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-accent">Events</h2>
        <button className="kora-button-primary px-4 py-2 text-sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </button>
      </div>
      
      <div className="kora-card p-8 text-center">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-medium text-accent mb-2">No events scheduled</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Create or join events to meet other mothers in person
        </p>
        <button className="kora-button-primary px-6 py-2">Browse Events</button>
      </div>
    </div>
  )

  const renderSupportTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-accent mb-2">Support & Resources</h2>
        <p className="text-muted-foreground">You're not alone in this journey</p>
      </div>
      
      <div className="space-y-4">
        <div className="kora-card p-4 hover:shadow-md transition-shadow">
          <h3 className="font-medium text-accent mb-2">Mental Health Chat</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Connect with our hosted mental health support community
          </p>
          <button className="kora-button-primary px-4 py-2 text-sm">Join Chat</button>
        </div>
        
        <div className="kora-card p-4 hover:shadow-md transition-shadow">
          <h3 className="font-medium text-accent mb-2">Specialized Support Groups</h3>
          <div className="space-y-2 mb-3">
            <div className="text-sm text-muted-foreground">• Migrant mothers support</div>
            <div className="text-sm text-muted-foreground">• Foster & adoption mothers</div>
            <div className="text-sm text-muted-foreground">• Medical challenges support</div>
            <div className="text-sm text-muted-foreground">• Neurodivergent families</div>
          </div>
          <button className="kora-button-secondary px-4 py-2 text-sm">Explore Groups</button>
        </div>
        
        <div className="kora-card p-4 hover:shadow-md transition-shadow">
          <h3 className="font-medium text-accent mb-2">Crisis Resources</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Immediate help and professional referrals when you need them most
          </p>
          <button className="kora-button-primary px-4 py-2 text-sm">Get Help Now</button>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeTab()
      case 'communities':
        return renderCommunitiesTab()
      case 'chat':
        return renderChatTab()
      case 'events':
        return renderEventsTab()
      case 'support':
        return renderSupportTab()
      default:
        return renderHomeTab()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 kora-gradient rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-accent">Kora</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-muted">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-full hover:bg-muted">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-border p-2">
        <div className="flex justify-around max-w-md mx-auto">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'communities', icon: Users, label: 'Communities' },
            { id: 'chat', icon: MessageCircle, label: 'Chat' },
            { id: 'events', icon: Calendar, label: 'Events' },
            { id: 'support', icon: Heart, label: 'Support' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-accent'
              }`}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}