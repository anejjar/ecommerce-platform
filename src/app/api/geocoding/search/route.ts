import { NextRequest, NextResponse } from 'next/server';

// Forward geocode: address to coordinates
// GET /api/geocoding/search?q={query}&limit={limit}
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') || '5';

    if (!query) {
      return NextResponse.json(
        { error: 'Missing query parameter' },
        { status: 400 }
      );
    }

    if (query.length < 3) {
      return NextResponse.json(
        { error: 'Query must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Validate limit
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 20) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 20' },
        { status: 400 }
      );
    }

    // Call Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&` +
        `countrycodes=ma&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=${limitNum}`,
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

    // Transform results to our format
    const results = data.map((item: any) => {
      const { address } = item;

      // Build full address string
      const addressParts = [];
      if (address.house_number) addressParts.push(address.house_number);
      if (address.road) addressParts.push(address.road);
      const fullAddress =
        addressParts.join(' ') || item.display_name.split(',')[0];

      // Extract city
      const city = address.city || address.town || address.village || '';

      return {
        placeId: item.place_id,
        displayName: item.display_name,
        address: fullAddress,
        city: city,
        state: address.state || '',
        postalCode: address.postcode || '',
        country: address.country || 'Morocco',
        coordinates: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        },
      };
    });

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    console.error('Forward geocoding error:', error);
    return NextResponse.json(
      { error: 'Failed to search for location' },
      { status: 500 }
    );
  }
}
