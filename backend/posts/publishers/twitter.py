"""
Twitter / X API v2 publisher via Tweepy.
Documentação: https://docs.tweepy.org/en/stable/client.html
Requer: access_token, token_secret, e extra_data com api_key e api_secret.
"""
import tweepy


def publish(social_account, text: str, image_path: str | None) -> dict:
    api_key = social_account.extra_data.get("api_key")
    api_secret = social_account.extra_data.get("api_secret")
    access_token = social_account.access_token
    access_token_secret = social_account.token_secret

    if not all([api_key, api_secret, access_token, access_token_secret]):
        raise ValueError("Credenciais do Twitter incompletas.")

    client = tweepy.Client(
        consumer_key=api_key,
        consumer_secret=api_secret,
        access_token=access_token,
        access_token_secret=access_token_secret,
    )

    media_id = None
    if image_path:
        auth = tweepy.OAuth1UserHandler(api_key, api_secret, access_token, access_token_secret)
        api_v1 = tweepy.API(auth)
        media = api_v1.media_upload(filename=image_path)
        media_id = media.media_id

    response = client.create_tweet(
        text=text,
        media_ids=[media_id] if media_id else None,
    )
    return {"id": response.data["id"]}
