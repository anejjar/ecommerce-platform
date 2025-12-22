import { NextRequest, NextResponse } from 'next/server';

// Reverse geocode: coordinates to address
// GET /api/geocoding/reverse?lat={lat}&lng={lng}
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Missing lat or lng parameter' },
        { status: 400 }
      );
    }

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Coordinates out of valid range' },
        { status: 400 }
      );
    }

    // Call Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?` +
        `lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'EcommercePlatform/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Nominatim API error');
    }

    const data = await response.json();

    // Parse address from Nominatim response
    const { address } = data;

    // Build full address string
    const addressParts = [];
    if (address.house_number) addressParts.push(address.house_number);
    if (address.road) addressParts.push(address.road);
    const fullAddress = addressParts.join(' ') || data.display_name.split(',')[0];

    // Extract city (can be in different fields)
    const city = address.city || address.town || address.village || '';

    // Return structured address data
    return NextResponse.json({
      success: true,
      data: {
        address: fullAddress,
        city: city,
        state: address.state || '',
        postalCode: address.postcode || '',
        country: address.country || 'Morocco',
        coordinates: { lat: latitude, lng: longitude },
        displayName: data.display_name,
      },
    });
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return NextResponse.json(
      { error: 'Failed to reverse geocode location' },
      { status: 500 }
    );
  }
}
