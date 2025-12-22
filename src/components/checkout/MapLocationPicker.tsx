'use client';

import { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin, Navigation, Check, Crosshair, Target } from 'lucide-react';
import { LocationData } from '@/types/checkout-settings';

interface MapLocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: LocationData) => void;
  initialPosition?: { lat: number; lng: number };
  defaultCenter?: { lat: number; lng: number } | null;
  zoomLevel?: number | null;
}

export function MapLocationPicker({
  isOpen,
  onClose,
  onLocationSelect,
  initialPosition,
  defaultCenter,
  zoomLevel = 13,
}: MapLocationPickerProps) {
  const [loading, setLoading] = useState(true);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number }>(
    initialPosition || defaultCenter || { lat: 33.5731, lng: -7.5898 } // Default: Casablanca, Morocco
  );

  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Leaflet map
  useEffect(() => {
    if (!isOpen) return;

    let L: any;
    let map: any;
    let marker: any;
    let mounted = true;

    const initMap = async () => {
      try {
        console.log('Initializing map...');
        setLoading(true);
        setError(null);

        // Wait for the dialog animation to complete and DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 300));

        if (!mapContainerRef.current) {
          console.error('Map container ref is not available');
          throw new Error('Map container not found');
        }

        if (!mounted) return;

        // Dynamically import Leaflet (client-side only)
        console.log('Importing Leaflet...');
        L = (await import('leaflet')).default;
        console.log('Leaflet loaded successfully');

        if (!mounted) return;

        // Fix for default marker icons in Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Initialize map
        console.log('Creating map instance...');
        console.log('Map container dimensions:', mapContainerRef.current.offsetWidth, mapContainerRef.current.offsetHeight);

        map = L.map(mapContainerRef.current, {
          preferCanvas: true,
          attributionControl: true,
        }).setView(
          [markerPosition.lat, markerPosition.lng],
          zoomLevel || 13
        );
        console.log('Map instance created');

        if (!mounted) return;

        // Add OpenStreetMap tiles
        console.log('Adding tile layer...');
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);
        console.log('Tile layer added');

        if (!mounted) return;

        // Add draggable marker
        marker = L.marker([markerPosition.lat, markerPosition.lng], {
          draggable: true,
        }).addTo(map);
        console.log('Marker added');

        // Store refs
        mapRef.current = map;
        markerRef.current = marker;

        // Handle marker drag end
        marker.on('dragend', async function () {
          const position = marker.getLatLng();
          setMarkerPosition({ lat: position.lat, lng: position.lng });
          await reverseGeocode(position.lat, position.lng);
        });

        // Handle map click (move marker)
        map.on('click', async function (e: any) {
          marker.setLatLng(e.latlng);
          setMarkerPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
          await reverseGeocode(e.latlng.lat, e.latlng.lng);
        });

        // Map is ready - stop loading
        console.log('Map initialization complete');
        setLoading(false);

        // Force map to invalidate size multiple times to ensure it renders
        setTimeout(() => {
          if (map && mounted) {
            map.invalidateSize();
            console.log('Map size invalidated (first pass)');
          }
        }, 100);

        setTimeout(() => {
          if (map && mounted) {
            map.invalidateSize();
            console.log('Map size invalidated (second pass)');
          }
        }, 300);

        setTimeout(() => {
          if (map && mounted) {
            map.invalidateSize();
            console.log('Map size invalidated (final pass)');
          }
        }, 500);

        // Initial reverse geocode (non-blocking - don't wait for it)
        console.log('Performing initial geocoding...');
        reverseGeocode(markerPosition.lat, markerPosition.lng).catch(err => {
          console.error('Initial geocoding failed:', err);
        });
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(`Failed to load map: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`);
        setLoading(false);
      }
    };

    initMap();

    // Cleanup
    return () => {
      mounted = false;
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          console.warn('Error removing map:', e);
        }
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen]);

  // Reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lng: number) => {
    setGeocoding(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/geocoding/reverse?lat=${lat}&lng=${lng}`
      );

      if (!response.ok) {
        throw new Error('Failed to geocode location');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to geocode location');
      }

      const locationData: LocationData = {
        address: result.data.address,
        city: result.data.city,
        state: result.data.state,
        postalCode: result.data.postalCode,
        country: result.data.country,
        coordinates: { lat, lng },
      };

      setSelectedLocation(locationData);
    } catch (err) {
      console.error('Geocoding error:', err);
      setError('Failed to get address for this location. You can still select it.');

      // Set basic location data even if geocoding fails
      setSelectedLocation({
        address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        city: '',
        state: '',
        postalCode: '',
        country: 'Morocco',
        coordinates: { lat, lng },
      });
    } finally {
      setGeocoding(false);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMarkerPosition({ lat: latitude, lng: longitude });

        // Move map and marker to current location
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([latitude, longitude], zoomLevel || 13);
          markerRef.current.setLatLng([latitude, longitude]);
          await reverseGeocode(latitude, longitude);
        }

        setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Failed to get your current location. Please select manually.');
        setLoading(false);
      }
    );
  };

  // Confirm location selection
  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Choose Location on Map
          </DialogTitle>
          <DialogDescription>
            Click or drag the marker to select your exact location. Check browser console (F12) for detailed logs.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden" style={{ minHeight: '0' }}>
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Map Container */}
          <div className="flex-1 relative rounded-lg overflow-hidden border bg-gray-100" style={{ minHeight: '450px' }}>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/90 z-10">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading map...</p>
                  <p className="text-xs text-muted-foreground mt-2">If stuck, check console (F12) for errors</p>
                </div>
              </div>
            )}

            {geocoding && (
              <div className="absolute top-4 right-4 z-[1000] bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border">
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Getting address...</span>
                </div>
              </div>
            )}

            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={getCurrentLocation}
              disabled={loading || geocoding}
              className="flex-1 sm:flex-none sm:w-auto"
              size="lg"
            >
              <Crosshair className="h-5 w-5 mr-2" />
              Use My Location
            </Button>

            <div className="flex gap-3 flex-1">
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedLocation || loading || geocoding}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg relative overflow-hidden group"
                size="lg"
              >
                {selectedLocation && (
                  <span className="absolute inset-0 bg-white/20 animate-pulse group-hover:animate-none" />
                )}
                <Check className="h-5 w-5 mr-2 relative z-10" />
                <span className="relative z-10">
                  Confirm Address
                </span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
