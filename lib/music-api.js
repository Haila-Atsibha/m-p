// Music API utility functions

/**
 * Get authentication token from localStorage
 * @returns {string|null} Authentication token or null if not found
 */
function getAuthToken() {
  if (typeof window === 'undefined') return null;
  
  try {
    const session = localStorage.getItem('session');
    if (!session) {
      console.log('No session found in localStorage');
      return null;
    }
    
    const sessionData = JSON.parse(session);
    console.log('Session data:', sessionData); // Debug log
    
    // Check for access_token in the session
    if (sessionData.access_token) {
      console.log('Found access_token:', sessionData.access_token.substring(0, 20) + '...');
      return sessionData.access_token;
    }
    
    // If no access_token, check if we need to redirect to login
    console.log('No access_token found in session data');
    return null;
  } catch (error) {
    console.error('Error parsing session data:', error);
    return null;
  }
}

/**
 * Fetch songs with optional search and filters
 * @param {Object} options - Search options
 * @param {string} options.search - Search query
 * @param {string} options.artist - Artist filter
 * @param {string} options.album - Album filter
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @returns {Promise<Object>} Songs response
 */
export async function fetchSongs(options = {}) {
  try {
    const params = new URLSearchParams();
    
    if (options.search) params.append('search', options.search);
    if (options.artist) params.append('artist', options.artist);
    if (options.album) params.append('album', options.album);
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    
    const response = await fetch(`/api/songs?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch songs: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching songs:', error);
    throw error;
  }
}

/**
 * Fetch user's playlists
 * @param {boolean} includeSongs - Whether to include songs in response
 * @returns {Promise<Object>} Playlists response
 */
export async function fetchPlaylists(includeSongs = false) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    console.log('Making playlist request with token:', token.substring(0, 20) + '...');
    
    const response = await fetch(`/api/playlists?include_songs=${includeSongs}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Playlist response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch playlists: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }
}

/**
 * Create a new playlist
 * @param {Object} playlistData - Playlist data
 * @param {string} playlistData.name - Playlist name
 * @param {string} playlistData.description - Playlist description (optional)
 * @returns {Promise<Object>} Created playlist
 */
export async function createPlaylist(playlistData) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    console.log('Creating playlist with data:', playlistData);
    console.log('Using token:', token.substring(0, 20) + '...');

    const response = await fetch('/api/playlists', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playlistData),
    });
    
    console.log('Create playlist response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Create playlist error response:', errorText);
      
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      
      let error;
      try {
        error = JSON.parse(errorText);
      } catch (e) {
        error = { error: `HTTP ${response.status}: ${errorText}` };
      }
      
      throw new Error(error.error || `Failed to create playlist: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Playlist created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
}

/**
 * Add a song to a playlist
 * @param {string} playlistId - Playlist ID
 * @param {string} songId - Song ID
 * @returns {Promise<Object>} Response
 */
export async function addSongToPlaylist(playlistId, songId) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(`/api/playlists/${playlistId}/songs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ song_id: songId }),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to add song to playlist');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    throw error;
  }
}

/**
 * Remove a song from a playlist
 * @param {string} playlistId - Playlist ID
 * @param {string} songId - Song ID
 * @returns {Promise<Object>} Response
 */
export async function removeSongFromPlaylist(playlistId, songId) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(`/api/playlists/${playlistId}/songs/${songId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove song from playlist');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    throw error;
  }
}

/**
 * Delete a playlist
 * @param {string} playlistId - Playlist ID
 * @returns {Promise<Object>} Response
 */
export async function deletePlaylist(playlistId) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(`/api/playlists/${playlistId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete playlist');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting playlist:', error);
    throw error;
  }
}

/**
 * Like/unlike a song
 * @param {string} songId - Song ID
 * @returns {Promise<Object>} Response
 */
export async function toggleSongLike(songId) {
  try {
    const response = await fetch(`/api/songs/${songId}/like`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to toggle song like');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error toggling song like:', error);
    throw error;
  }
}

/**
 * Track song play in history
 * @param {string} songId - Song ID
 * @returns {Promise<Object>} Response
 */
export async function trackSongPlay(songId) {
  try {
    const token = getAuthToken();
    if (!token) {
      // Don't throw error for history tracking, just log it
      console.log('Cannot track song play - not authenticated');
      return null;
    }

    const response = await fetch(`/api/users/${getCurrentUserId()}/history`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ songId }),
    });
    
    if (!response.ok) {
      console.error('Failed to track song play:', response.status);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error tracking song play:', error);
    return null;
  }
}

/**
 * Fetch user's play history
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @returns {Promise<Object>} History response
 */
export async function fetchHistory(options = {}) {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);

    const response = await fetch(`/api/users/${getCurrentUserId()}/history?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch history');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
}

/**
 * Fetch user's favorite songs
 * @returns {Promise<Array>} Array of favorite songs
 */
export async function fetchFavorites() {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    console.log('Making favorites request with token:', token.substring(0, 20) + '...');
    
    const response = await fetch('/api/favorites', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Favorites response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch favorites: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
}

/**
 * Get current user ID from session
 * @returns {string|null} User ID or null if not found
 */
function getCurrentUserId() {
  if (typeof window === 'undefined') return null;
  
  try {
    const session = localStorage.getItem('session');
    if (session) {
      const sessionData = JSON.parse(session);
      return sessionData.user_id || null;
    }
  } catch (error) {
    console.error('Error getting user ID:', error);
  }
  return null;
}
