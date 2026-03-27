# Source: https://developer.spotify.com/documentation/web-api/reference/get-recently-played
# Last fetched: 2026-03-27T18:38:37.271521+00:00

Web API •References / Player / Get Recently Played Tracks

# Get Recently Played Tracks

OAuth 2.0

Get tracks from the current user's recently played tracks.
***Note**: Currently doesn't support podcast episodes.*

Important policy notes

* Streaming applications may not be commercial

  The Spotify Platform can not be used to develop commercial streaming integrations.

  [More information](/policy/#iv-streaming-and-commercial-use:~:text=Commercial use restrictions,Streaming SDA itself.)
* Keep audio content in its original form

  The Spotify Platform can not be used to develop applications that alter Spotify Content.

  [More information](/policy/#iii-some-prohibited-applications:~:text=Do not permit any device or system to segue,.)
* Do not synchronize Spotify content

  You may not synchronize any sound recordings with any visual media, including any advertising, film, television program, slideshow, video, or similar content

  [More information](/policy/#iii-some-prohibited-applications:~:text=Do not synchronize any sound recordings with any visual media,.)
* Spotify content may not be broadcasted

  The Spotify Platform can not be used for non-interactive broadcasting.

  [More information](/policy/#iii-some-prohibited-applications:~:text=Do not create any product or service which includes any non,several simultaneous listeners.)

Authorization scopes

* user-read-recently-played

  Access your recently played items.

  [Read more](/documentation/web-api/concepts/scopes#user-read-recently-played)

## Request

GET/me/player/recently-played

* limitinteger

  The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.

  Default: `limit=20`Range: `0` - `50`Example: `limit=10`
* afterinteger

  A Unix timestamp in milliseconds. Returns all items
  after (but not including) this cursor position. If `after` is specified, `before`
  must not be specified.

  Example: `after=1484811043508`
* beforeinteger

  A Unix timestamp in milliseconds. Returns all items
  before (but not including) this cursor position. If `before` is specified,
  `after` must not be specified.

## Response

* 200
* 401
* 403
* 429

A paged set of tracks

* hrefstring

  A link to the Web API endpoint returning the full result of the request.
* limitinteger

  The maximum number of items in the response (as set in the query or by default).
* nextstring

  URL to the next page of items. ( `null` if none)
* cursorsobject

  The cursors used to find the next set of items.

  + afterstring

    The cursor to use as key to find the next page of items.
  + beforestring

    The cursor to use as key to find the previous page of items.
* totalinteger

  The total number of items available to return.
* itemsarray of PlayHistoryObject

  + trackobject

    The track the user listened to.

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
  + played\_atstring [date-time]

    The date and time the track was played.
  + contextobject

    The context the track was played from.

    - typestring

      The object type, e.g. "artist", "playlist", "album", "show".
    - hrefstring

      A link to the Web API endpoint providing full details of the track.
    - external\_urlsobject

      External URLs for this context.

      * spotifystring

        The [Spotify URL](/documentation/web-api/concepts/spotify-uris-ids) for the object.
    - uristring

      The [Spotify URI](/documentation/web-api/concepts/spotify-uris-ids) for the context.

## Response sample

```
{  "href": "string",  "limit": 0,  "next": "string",  "cursors": {    "after": "string",    "before": "string"  },  "total": 0,  "items": [    {      "track": {        "album": {          "album_type": "compilation",          "total_tracks": 9,          "available_markets": ["CA", "BR", "IT"],          "external_urls": {            "spotify": "string"          },          "href": "string",          "id": "2up3OPMp9Tb4dAKM2erWXQ",          "images": [            {              "url": "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",              "height": 300,              "width": 300            }          ],          "name": "string",          "release_date": "1981-12",          "release_date_precision": "year",          "restrictions": {            "reason": "market"          },          "type": "album",          "uri": "spotify:album:2up3OPMp9Tb4dAKM2erWXQ",          "artists": [            {              "external_urls": {                "spotify": "string"              },              "href": "string",              "id": "string",              "name": "string",              "type": "artist",              "uri": "string"            }          ]        },        "artists": [          {            "external_urls": {              "spotify": "string"            },            "href": "string",            "id": "string",            "name": "string",            "type": "artist",            "uri": "string"          }        ],        "available_markets": ["string"],        "disc_number": 0,        "duration_ms": 0,        "explicit": false,        "external_ids": {          "isrc": "string",          "ean": "string",          "upc": "string"        },        "external_urls": {          "spotify": "string"        },        "href": "string",        "id": "string",        "is_playable": false,        "linked_from": {        },        "restrictions": {          "reason": "string"        },        "name": "string",        "popularity": 0,        "preview_url": "string",        "track_number": 0,        "type": "track",        "uri": "string",        "is_local": false      },      "played_at": "string",      "context": {        "type": "string",        "href": "string",        "external_urls": {          "spotify": "string"        },        "uri": "string"      }    }  ]}
```
