# Source: https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
# Last fetched: 2026-03-27T18:38:37.271521+00:00

Web API •References / Users / Get User's Top Items

# Get User's Top Items

OAuth 2.0

Get the current user's top artists or tracks based on calculated affinity.

Authorization scopes

* user-top-read

  Read your top artists and content.

  [Read more](/documentation/web-api/concepts/scopes#user-top-read)

## Request

GET/me/top/{type}

* typestring

  Required

  The type of entity to return. Valid values: `artists` or `tracks`

  Allowed values: `"artists"`, `"tracks"`
* time\_rangestring

  Over what time frame the affinities are computed. Valid values: `long_term` (calculated from ~1 year of data and including all new data as it becomes available), `medium_term` (approximately last 6 months), `short_term` (approximately last 4 weeks). Default: `medium_term`

  Default: `time_range=medium_term`Example: `time_range=medium_term`
* limitinteger

  The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.

  Default: `limit=20`Range: `0` - `50`Example: `limit=10`
* offsetinteger

  The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items.

  Default: `offset=0`Example: `offset=5`

## Response

* 200
* 401
* 403
* 429

Pages of artists or tracks

* hrefstring

  Required

  A link to the Web API endpoint returning the full result of the request

  Example: `"https://api.spotify.com/v1/me/shows?offset=0&limit=20"`
* limitinteger

  Required

  The maximum number of items in the response (as set in the query or by default).

  Example: `20`
* nextstring

  Required

  Nullable

  URL to the next page of items. ( `null` if none)

  Example: `"https://api.spotify.com/v1/me/shows?offset=1&limit=1"`
* offsetinteger

  Required

  The offset of the items returned (as set in the query or by default)

  Example: `0`
* previousstring

  Required

  Nullable

  URL to the previous page of items. ( `null` if none)

  Example: `"https://api.spotify.com/v1/me/shows?offset=1&limit=1"`
* totalinteger

  Required

  The total number of items available to return.

  Example: `4`
* itemsarray of oneOfs

  Required

  Will be one of the following:

  + ArtistObjectobject

    - external\_urlsobject

      Known external URLs for this artist.

      * spotifystring

        The [Spotify URL](/documentation/web-api/concepts/spotify-uris-ids) for the object.
    - followersobject

      Deprecated

      Information about the followers of the artist.

      * hrefstring

        Nullable

        This will always be set to null, as the Web API does not support it at the moment.
      * totalinteger

        The total number of followers.
    - genresarray of strings

      Deprecated

      A list of the genres the artist is associated with. If not yet classified, the array is empty.

      Example: `["Prog rock","Grunge"]`
    - hrefstring

      A link to the Web API endpoint providing full details of the artist.
    - idstring

      The [Spotify ID](/documentation/web-api/concepts/spotify-uris-ids) for the artist.
    - imagesarray of ImageObject

      Images of the artist in various sizes, widest first.

      * urlstring

        Required

        The source URL of the image.

        Example: `"https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"`
      * heightinteger

        Required

        Nullable

        The image height in pixels.

        Example: `300`
      * widthinteger

        Required

        Nullable

        The image width in pixels.

        Example: `300`
    - namestring

      The name of the artist.
    - popularityinteger

      Deprecated

      The popularity of the artist. The value will be between 0 and 100, with 100 being the most popular. The artist's popularity is calculated from the popularity of all the artist's tracks.
    - typestring

      The object type.

      Allowed values: `"artist"`
    - uristring

      The [Spotify URI](/documentation/web-api/concepts/spotify-uris-ids) for the artist.
  + TrackObjectobject

    - albumobject

      The album on which the track appears. The album object includes a link in `href` to full information about the album.

      * album\_typestring

        Required

        The type of the album.

        Allowed values: `"album"`, `"single"`, `"compilation"`Example: `"compilation"`
      * total\_tracksinteger

        Required

        The number of tracks in the album.

        Example: `9`
      * available\_marketsarray of strings

        Required

        Deprecated

        The markets in which the album is available: [ISO 3166-1 alpha-2 country codes](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). ***NOTE**: an album is considered available in a market when at least 1 of its tracks is available in that market.*

        Example: `["CA","BR","IT"]`
      * external\_urlsobject

        Required

        Known external URLs for this album.

        + spotifystring

          The [Spotify URL](/documentation/web-api/concepts/spotify-uris-ids) for the object.
      * hrefstring

        Required

        A link to the Web API endpoint providing full details of the album.
      * idstring

        Required

        The [Spotify ID](/documentation/web-api/concepts/spotify-uris-ids) for the album.

        Example: `"2up3OPMp9Tb4dAKM2erWXQ"`
      * imagesarray of ImageObject

        Required

        The cover art for the album in various sizes, widest first.

        + urlstring

          Required

          The source URL of the image.

          Example: `"https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"`
        + heightinteger

          Required

          Nullable

          The image height in pixels.

          Example: `300`
        + widthinteger

          Required

          Nullable

          The image width in pixels.

          Example: `300`
      * namestring

        Required

        The name of the album. In case of an album takedown, the value may be an empty string.
      * release\_datestring

        Required

        The date the album was first released.

        Example: `"1981-12"`
      * release\_date\_precisionstring

        Required

        The precision with which `release_date` value is known.

        Allowed values: `"year"`, `"month"`, `"day"`Example: `"year"`
      * restrictionsobject

        Included in the response when a content restriction is applied.

        + reasonstring

          The reason for the restriction. Albums may be restricted if the content is not available in a given market, to the user's subscription type, or when the user's account is set to not play explicit content.
          Additional reasons may be added in the future.

          Allowed values: `"market"`, `"product"`, `"explicit"`
      * typestring

        Required

        The object type.

        Allowed values: `"album"`
      * uristring

        Required

        The [Spotify URI](/documentation/web-api/concepts/spotify-uris-ids) for the album.

        Example: `"spotify:album:2up3OPMp9Tb4dAKM2erWXQ"`
      * artistsarray of SimplifiedArtistObject

        Required

        The artists of the album. Each artist object includes a link in `href` to more detailed information about the artist.

        + external\_urlsobject

          Known external URLs for this artist.

          - spotifystring

            The [Spotify URL](/documentation/web-api/concepts/spotify-uris-ids) for the object.
        + hrefstring

          A link to the Web API endpoint providing full details of the artist.
        + idstring

          The [Spotify ID](/documentation/web-api/concepts/spotify-uris-ids) for the artist.
        + namestring

          The name of the artist.
        + typestring

          The object type.

          Allowed values: `"artist"`
        + uristring

          The [Spotify URI](/documentation/web-api/concepts/spotify-uris-ids) for the artist.
    - artistsarray of SimplifiedArtistObject

      The artists who performed the track. Each artist object includes a link in `href` to more detailed information about the artist.

      * external\_urlsobject

        Known external URLs for this artist.

        + spotifystring

          The [Spotify URL](/documentation/web-api/concepts/spotify-uris-ids) for the object.
      * hrefstring

        A link to the Web API endpoint providing full details of the artist.
      * idstring

        The [Spotify ID](/documentation/web-api/concepts/spotify-uris-ids) for the artist.
      * namestring

        The name of the artist.
      * typestring

        The object type.

        Allowed values: `"artist"`
      * uristring

        The [Spotify URI](/documentation/web-api/concepts/spotify-uris-ids) for the artist.
    - available\_marketsarray of strings

      Deprecated

      A list of the countries in which the track can be played, identified by their [ISO 3166-1 alpha-2](http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code.
    - disc\_numberinteger

      The disc number (usually `1` unless the album consists of more than one disc).
    - duration\_msinteger

      The track length in milliseconds.
    - explicitboolean

      Whether or not the track has explicit lyrics ( `true` = yes it does; `false` = no it does not OR unknown).
    - external\_idsobject

      Known external IDs for the track.

      * isrcstring

        [International Standard Recording Code](http://en.wikipedia.org/wiki/International_Standard_Recording_Code)
      * eanstring

        [International Article Number](http://en.wikipedia.org/wiki/International_Article_Number_%28EAN%29)
      * upcstring

        [Universal Product Code](http://en.wikipedia.org/wiki/Universal_Product_Code)
    - external\_urlsobject

      Known external URLs for this track.

      * spotifystring

        The [Spotify URL](/documentation/web-api/concepts/spotify-uris-ids) for the object.
    - hrefstring

      A link to the Web API endpoint providing full details of the track.
    - idstring

      The [Spotify ID](/documentation/web-api/concepts/spotify-uris-ids) for the track.
    - is\_playableboolean

      Part of the response when [Track Relinking](/documentation/web-api/concepts/track-relinking) is applied. If `true`, the track is playable in the given market. Otherwise `false`.
    - linked\_fromobject

      Deprecated

      Part of the response when [Track Relinking](/documentation/web-api/concepts/track-relinking) is applied, and the requested track has been replaced with different track. The track in the `linked_from` object contains information about the originally requested track.
    - restrictionsobject

      Included in the response when a content restriction is applied.

      * reasonstring

        The reason for the restriction. Supported values:

        + `market` - The content item is not available in the given market.
        + `product` - The content item is not available for the user's subscription type.
        + `explicit` - The content item is explicit and the user's account is set to not play explicit content.

        Additional reasons may be added in the future.
        **Note**: If you use this field, make sure that your application safely handles unknown values.
    - namestring

      The name of the track.
    - popularityinteger

      Deprecated

      The popularity of the track. The value will be between 0 and 100, with 100 being the most popular.
      The popularity of a track is a value between 0 and 100, with 100 being the most popular. The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.
      Generally speaking, songs that are being played a lot now will have a higher popularity than songs that were played a lot in the past. Duplicate tracks (e.g. the same track from a single and an album) are rated independently. Artist and album popularity is derived mathematically from track popularity. ***Note**: the popularity value may lag actual popularity by a few days: the value is not updated in real time.*
    - preview\_urlstring

      Nullable

      Deprecated

      A link to a 30 second preview (MP3 format) of the track. Can be `null`

      Important policy note

      * Spotify Audio preview clips can not be a standalone service

        Audio Preview Clips may not be offered as a standalone service or product.

        [More information](/policy/#ii-respect-content-and-creators:~:text=You must not offer metadata,as a standalone service or product.)
    - track\_numberinteger

      The number of the track. If an album has several discs, the track number is the number on the specified disc.
    - typestring

      The object type: "track".

      Allowed values: `"track"`
    - uristring

      The [Spotify URI](/documentation/web-api/concepts/spotify-uris-ids) for the track.
    - is\_localboolean

      Whether or not the track is from a local file.

## Response sample

```
{  "href": "https://api.spotify.com/v1/me/shows?offset=0&limit=20",  "limit": 20,  "next": "https://api.spotify.com/v1/me/shows?offset=1&limit=1",  "offset": 0,  "previous": "https://api.spotify.com/v1/me/shows?offset=1&limit=1",  "total": 4,  "items": [    {      "external_urls": {        "spotify": "string"      },      "followers": {        "href": "string",        "total": 0      },      "genres": ["Prog rock", "Grunge"],      "href": "string",      "id": "string",      "images": [        {          "url": "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",          "height": 300,          "width": 300        }      ],      "name": "string",      "popularity": 0,      "type": "artist",      "uri": "string"    }  ]}
```
