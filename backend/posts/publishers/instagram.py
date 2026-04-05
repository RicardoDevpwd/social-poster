"""
Instagram Graph API publisher.
Documentação: https://developers.facebook.com/docs/instagram-api/guides/content-publishing
Requer: access_token com permissão instagram_basic, instagram_content_publish
         e o campo extra_data["ig_user_id"] com o Instagram User ID.
"""
import requests


def publish(social_account, text: str, image_path: str | None) -> dict:
    token = social_account.access_token
    ig_user_id = social_account.extra_data.get("ig_user_id")
    if not ig_user_id:
        raise ValueError("Instagram User ID não configurado em extra_data['ig_user_id'].")

    base = f"https://graph.facebook.com/v19.0/{ig_user_id}"

    if image_path:
        # 1) Criar container de mídia
        container_resp = requests.post(
            f"{base}/media",
            data={"image_url": image_path, "caption": text, "access_token": token},
        )
        container_resp.raise_for_status()
        container_id = container_resp.json()["id"]

        # 2) Publicar container
        publish_resp = requests.post(
            f"{base}/media_publish",
            data={"creation_id": container_id, "access_token": token},
        )
        publish_resp.raise_for_status()
        return publish_resp.json()
    else:
        raise ValueError("Instagram requer uma imagem para publicar.")
