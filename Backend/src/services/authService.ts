import { supabase } from '../config/supabase'

export const sendEmailOtp = async (email: string): Promise<{status: boolean; message?: string}> => {
  try {
    const { error } = await supabase.auth.signInWithOtp({ email })
    
    if (error) {
      return { status: false, message: error.message }
    }
    
    return { status: true }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const verifyOtp = async ({ email, otp }: { email: string; otp: string }): Promise<{status: boolean; user?: any; session?: any; message?: string}> => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({ 
      email, 
      token: otp, 
      type: 'email' 
    })
    
    if (error) {
      return { status: false, message: error.message }
    }
    
    return { status: true, user: data.user, session: data.session }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const signInWithGoogle = async (): Promise<{status: boolean; url?: string; message?: string}> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: process.env.REDIRECT_URL
      }
    })
    
    if (error) {
      return { status: false, message: error.message }
    }
    
    return { status: true, url: data.url }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const signOut = async (accessToken: string): Promise<{status: boolean; message?: string}> => {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return { status: false, message: error.message }
    }
    
    return { status: true }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}

export const validateSession = async (accessToken: string): Promise<{status: boolean; user?: any; message?: string}> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (error) {
      return { status: false, message: error.message }
    }
    
    return { status: true, user }
  } catch (error: any) {
    return { status: false, message: error.message }
  }
}