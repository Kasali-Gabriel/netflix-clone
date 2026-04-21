import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TmdbService {
  private readonly accessToken: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('TMDB_API_KEY');

    if (!token) {
      throw new Error('Missing TMDB API Read Access Token');
    }

    this.accessToken = token.trim();
  }

  async fetchFromTMDB(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<any> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();

      throw new Error(
        `TMDB request failed: ${response.status} ${response.statusText} - ${errorBody}`,
      );
    }

    return response.json();
  }
}
