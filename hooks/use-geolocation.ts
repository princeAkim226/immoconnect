'use client'

import { useState, useEffect } from 'react'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  isLoading: boolean
}

interface GeolocationResult {
  latitude: number
  longitude: number
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: true,
  })

  const getLocation = (): Promise<GeolocationResult> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("La géolocalisation n'est pas supportée par votre navigateur"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          reject(new Error(error.message))
        }
      )
    })
  }

  useEffect(() => {
    getLocation()
      .then(({ latitude, longitude }) => {
        setState({
          latitude,
          longitude,
          error: null,
          isLoading: false,
        })
      })
      .catch((error) => {
        setState(prev => ({
          ...prev,
          error: error.message,
          isLoading: false,
        }))
      })
  }, [])

  return { ...state, getLocation }
}
