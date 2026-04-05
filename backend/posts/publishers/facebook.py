"""
Facebook Graph API publisher.
Documentação: https://developers.facebook.com/docs/pages/publishing
Requer: access_token (Page Access Token) e extra_data["page_id"].
"""
import requests


def publish(social_account, text: str, image_path: str | None) -> dict:
    token = social_account.access_token
    page_id = social_account.extra_data.get("page_id")
    if not page_id:
        raise ValueError("Facebook Page ID não configurado em extra_data['page_id'].")

    base = f"https://graph.facebook.com/v19.0/{page_id}"

    if image_path:
        with open(image_path, "rb") as img_file:
            resp = requests.post(
                f"{base}/photos",
                data={"caption": text, "access_token": token},
                files={"source": img_file},
            )
    else:
        resp = requests.post(
            f"{base}/feed",
            data={"message": text, "access_token": token},
        )

    resp.raise_for_status()
    return resp.json()
