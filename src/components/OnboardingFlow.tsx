import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Upload, MapPin, Clock, Heart, Users, Baby, Calendar, Target } from 'lucide-react'
import { blink } from '../blink/client'

interface OnboardingFlowProps {
  onComplete: () => void
}

interface OnboardingData {
  // Step 1: Profile Setup
  firstName: string
  lastName: string
  profilePhoto: string
  
  // Step 2: Connection Preferences
  connectionType: 'groups' | 'oneOnOne' | 'both'
  
  // Step 3: Interests & Values
  interests: string[]
  
  // Step 4: Parenting Style
  parentingStyle: string
  
  // Step 5: Kids Information
  kidsAges: string[]
  schoolInfo: string
  
  // Step 6: Location & Availability
  location: string
  availability: string[]
  
  // Step 7: Depth Matching
  connectionDepth: 'casual' | 'meaningful' | 'deep'
  
  // Step 8: Goals
  goals: string[]
}

const initialData: OnboardingData = {
  firstName: '',
  lastName: '',
  profilePhoto: '',
  connectionType: 'both',
  interests: [],
  parentingStyle: '',
  kidsAges: [],
  schoolInfo: '',
  location: '',
  availability: [],
  connectionDepth: 'meaningful',
  goals: []
}

const interestCategories = {
  'Wellness': ['Yoga', 'Meditation', 'Fitness', 'Mental Health', 'Self-Care', 'Nutrition'],
  'Activities': ['Hiking', 'Crafts', 'Reading', 'Cooking', 'Photography', 'Gardening'],
  'Parenting': ['Gentle Parenting', 'Montessori', 'Homeschooling', 'Special Needs', 'Breastfeeding', 'Sleep Training'],
  'Lifestyle': ['Working Mom', 'Stay-at-Home', 'Single Mom', 'Minimalism', 'Sustainability', 'Travel']
}

const parentingStyles = [
  'Gentle Parenting',
  'Traditional',
  'Balanced',
  'Attachment Parenting',
  'Positive Discipline',
  'Montessori',
  'Waldorf',
  'Free-Range',
  'Still Figuring It Out'
]

const availabilityOptions = [
  'Weekday Mornings',
  'Weekday Afternoons',
  'Weekday Evenings',
  'Weekend Mornings',
  'Weekend Afternoons',
  'Weekend Evenings',
  'School Hours Only',
  'Flexible Schedule'
]

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [loading, setLoading] = useState(false)

  const totalSteps = 8

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }, [])

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const user = await blink.auth.me()
      
      await blink.db.user_profiles.create({
        id: `profile_${user.id}`,
        user_id: user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        profile_photo: data.profilePhoto,
        connection_type: data.connectionType,
        interests: JSON.stringify(data.interests),
        parenting_style: data.parentingStyle,
        kids_ages: JSON.stringify(data.kidsAges),
        school_info: data.schoolInfo,
        location: data.location,
        availability: JSON.stringify(data.availability),
        connection_depth: data.connectionDepth,
        goals: JSON.stringify(data.goals),
        onboarding_completed: true,
        created_at: new Date().toISOString()
      })
      
      onComplete()
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-accent mb-2">Let's get to know you</h2>
              <p className="text-muted-foreground">Tell us a bit about yourself</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-accent mb-2">First Name</label>
                <input
                  type="text"
                  value={data.firstName}
                  onChange={(e) => updateData({ firstName: e.target.value })}
                  className="kora-input w-full"
                  placeholder="Enter your first name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-accent mb-2">Last Name</label>
                <input
                  type="text"
                  value={data.lastName}
                  onChange={(e) => updateData({ lastName: e.target.value })}
                  className="kora-input w-full"
                  placeholder="Enter your last name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-accent mb-2">Profile Photo</label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    {data.profilePhoto ? (
                      <img src={data.profilePhoto} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <button className="kora-button-secondary px-4 py-2 text-sm">
                    Upload Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-accent mb-2">How do you prefer to connect?</h2>
              <p className="text-muted-foreground">Choose what feels right for you</p>
            </div>
            
            <div className="space-y-3">
              {[
                { value: 'groups', label: 'Small Groups (3-6 people)', desc: 'Join intimate groups with shared interests' },
                { value: 'oneOnOne', label: 'One-on-One Connections', desc: 'Build deep friendships with individual mothers' },
                { value: 'both', label: 'Both Options', desc: 'Open to groups and individual connections' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateData({ connectionType: option.value as any })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    data.connectionType === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-white hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium text-accent">{option.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-accent mb-2">What are you interested in?</h2>
              <p className="text-muted-foreground">Select all that apply</p>
            </div>
            
            <div className="space-y-6">
              {Object.entries(interestCategories).map(([category, items]) => (
                <div key={category}>
                  <h3 className="font-medium text-accent mb-3">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => updateData({ interests: toggleArrayItem(data.interests, interest) })}
                        className={`kora-tag ${data.interests.includes(interest) ? 'selected' : ''}`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Baby className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-accent mb-2">What's your parenting style?</h2>
              <p className="text-muted-foreground">Choose what resonates with you</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {parentingStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => updateData({ parentingStyle: style })}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    data.parentingStyle === style
                      ? 'border-primary bg-primary/5 text-accent'
                      : 'border-border bg-white hover:border-primary/50 text-muted-foreground'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Baby className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-accent mb-2">Tell us about your kids</h2>
              <p className="text-muted-foreground">This helps us find compatible connections</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-accent mb-2">Kids' Ages</label>
                <div className="flex flex-wrap gap-2">
                  {['0-1', '1-2', '2-3', '3-5', '5-8', '8-12', '12-16', '16+'].map((age) => (
                    <button
                      key={age}
                      onClick={() => updateData({ kidsAges: toggleArrayItem(data.kidsAges, age) })}
                      className={`kora-tag ${data.kidsAges.includes(age) ? 'selected' : ''}`}
                    >
                      {age} years
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-accent mb-2">School Information (Optional)</label>
                <input
                  type="text"
                  value={data.schoolInfo}
                  onChange={(e) => updateData({ schoolInfo: e.target.value })}
                  className="kora-input w-full"
                  placeholder="e.g., Montessori, Public School, Homeschool"
                />
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-accent mb-2">Location & Availability</h2>
              <p className="text-muted-foreground">Help us find nearby connections</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-accent mb-2">Location</label>
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => updateData({ location: e.target.value })}
                  className="kora-input w-full"
                  placeholder="City, State or Neighborhood"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-accent mb-2">When are you usually available?</label>
                <div className="grid grid-cols-2 gap-2">
                  {availabilityOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => updateData({ availability: toggleArrayItem(data.availability, option) })}
                      className={`p-3 rounded-xl border-2 text-sm transition-all ${
                        data.availability.includes(option)
                          ? 'border-primary bg-primary/5 text-accent'
                          : 'border-border bg-white hover:border-primary/50 text-muted-foreground'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-accent mb-2">What kind of connections do you seek?</h2>
              <p className="text-muted-foreground">Choose what feels right for you</p>
            </div>
            
            <div className="space-y-3">
              {[
                { value: 'casual', label: 'Casual Connections', desc: 'Light, fun interactions and activities' },
                { value: 'meaningful', label: 'Meaningful Friendships', desc: 'Deeper conversations and regular meetups' },
                { value: 'deep', label: 'Deep Support Network', desc: 'Close bonds with mutual support and understanding' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateData({ connectionDepth: option.value as any })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    data.connectionDepth === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-white hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium text-accent">{option.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-accent mb-2">What are your goals?</h2>
              <p className="text-muted-foreground">What do you hope to achieve through Kora?</p>
            </div>
            
            <div className="space-y-3">
              {[
                'Find mom friends in my area',
                'Get support for specific challenges',
                'Join activity groups',
                'Find playmates for my kids',
                'Access mental health resources',
                'Connect with other working moms',
                'Find single mom support',
                'Connect with special needs parents',
                'Build a support network',
                'Just looking to chat and connect'
              ].map((goal) => (
                <button
                  key={goal}
                  onClick={() => updateData({ goals: toggleArrayItem(data.goals, goal) })}
                  className={`w-full p-3 rounded-xl border-2 text-left text-sm transition-all ${
                    data.goals.includes(goal)
                      ? 'border-primary bg-primary/5 text-accent'
                      : 'border-border bg-white hover:border-primary/50 text-muted-foreground'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.firstName.trim() && data.lastName.trim()
      case 2:
        return data.connectionType
      case 3:
        return data.interests.length > 0
      case 4:
        return data.parentingStyle
      case 5:
        return data.kidsAges.length > 0
      case 6:
        return data.location.trim() && data.availability.length > 0
      case 7:
        return data.connectionDepth
      case 8:
        return data.goals.length > 0
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-muted h-1">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="p-2 rounded-full hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</div>
        </div>
        
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-md mx-auto">
          <div className="fade-in">
            {renderStep()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="max-w-md mx-auto">
          {currentStep === totalSteps ? (
            <button
              onClick={handleComplete}
              disabled={!canProceed() || loading}
              className="kora-button-primary w-full py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting up your profile...' : 'Complete Setup'}
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="kora-button-primary w-full py-3 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}