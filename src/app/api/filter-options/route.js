import { NextResponse } from 'next/server';
import { getFilterOptions } from '../../../lib/db';

export async function GET() {
  try {
    const filterOptions = await getFilterOptions();

    return NextResponse.json({
      success: true,
      categories: filterOptions.categories || [],
      transmissions: filterOptions.transmissions || [],
      fuelTypes: filterOptions.fuelTypes || [],
      locations: filterOptions.locations || []
    });

  } catch (error) {
    console.error('Filter options API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}
