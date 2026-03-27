# Source: https://developer.spotify.com/documentation/web-api/reference/get-several-audio-features
# Last fetched: 2026-03-27T18:38:37.271521+00:00

Web API •References / Tracks / Get Several Tracks' Audio Features

# Get Several Tracks' Audio Features

OAuth 2.0

Deprecated

Get audio features for multiple tracks based on their Spotify IDs.

Important policy note

* Spotify content may not be used to train machine learning or AI model

  Please note that you can not use the Spotify Platform or any Spotify Content to train a machine learning or AI model or otherwise ingesting Spotify Content into a machine learning or AI model.

  [More information](/terms#section-iv-restrictions:~:text=Misuse%20of%20the,or%20AI%20model%3B)

## Request

GET/audio-features

* idsstring

  Required

  A comma-separated list of the [Spotify IDs](/documentation/web-api/concepts/spotify-uris-ids)
  for the tracks. Maximum: 100 IDs.

  Example: `ids=7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B`

## Response

* 200
* 401
* 403
* 429

A set of audio features

* audio\_featuresarray of AudioFeaturesObject

  Required

  + acousticnessnumber [float]

    A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.

    Range: `0` - `1`Example: `0.00242`
  + analysis\_urlstring

    A URL to access the full audio analysis of this track. An access token is required to access this data.

    Example: `"https://api.spotify.com/v1/audio-analysis/2takcwOaAZWiXQijPHIx7B"`
  + danceabilitynumber [float]

    Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.

    Example: `0.585`
  + duration\_msinteger

    The duration of the track in milliseconds.

    Example: `237040`
  + energynumber [float]

    Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.

    Example: `0.842`
  + idstring

    The Spotify ID for the track.

    Example: `"2takcwOaAZWiXQijPHIx7B"`
  + instrumentalnessnumber [float]

    Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.

    Example: `0.00686`
  + keyinteger

    The key the track is in. Integers map to pitches using standard [Pitch Class notation](https://en.wikipedia.org/wiki/Pitch_class). E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on. If no key was detected, the value is -1.

    Range: `-1` - `11`Example: `9`
  + livenessnumber [float]

    Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.

    Example: `0.0866`
  + loudnessnumber [float]

    The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db.

    Example: `-5.883`
  + modeinteger

    Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0.

    Example: `0`
  + speechinessnumber [float]

    Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.

    Example: `0.0556`
  + temponumber [float]

    The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.

    Example: `118.211`
  + time\_signatureinteger

    An estimated time signature. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure). The time signature ranges from 3 to 7 indicating time signatures of "3/4", to "7/4".

    Range: `3` - `7`Example: `4`
  + track\_hrefstring

    A link to the Web API endpoint providing full details of the track.

    Example: `"https://api.spotify.com/v1/tracks/2takcwOaAZWiXQijPHIx7B"`
  + typestring

    The object type.

    Allowed values: `"audio_features"`
  + uristring

    The Spotify URI for the track.

    Example: `"spotify:track:2takcwOaAZWiXQijPHIx7B"`
  + valencenumber [float]

    A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).

    Range: `0` - `1`Example: `0.428`

## Response sample

```
{  "audio_features": [    {      "acousticness": 0.00242,      "analysis_url": "https://api.spotify.com/v1/audio-analysis/2takcwOaAZWiXQijPHIx7B",      "danceability": 0.585,      "duration_ms": 237040,      "energy": 0.842,      "id": "2takcwOaAZWiXQijPHIx7B",      "instrumentalness": 0.00686,      "key": 9,      "liveness": 0.0866,      "loudness": -5.883,      "mode": 0,      "speechiness": 0.0556,      "tempo": 118.211,      "time_signature": 4,      "track_href": "https://api.spotify.com/v1/tracks/2takcwOaAZWiXQijPHIx7B",      "type": "audio_features",      "uri": "spotify:track:2takcwOaAZWiXQijPHIx7B",      "valence": 0.428    }  ]}
```
