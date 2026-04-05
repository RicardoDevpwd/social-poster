"""
LinkedIn API v2 publisher.
Documentação: https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/ugc-post-api
Requer: access_token e extra_data["person_urn"] (ex: "urn:li:person:XXXX").
"""
import requests


def publish(social_account, text: str, image_path: str | None) -> dict:
    token = social_account.access_token
    person_urn = social_account.extra_data.get("person_urn")
    if not person_urn:
        raise ValueError("LinkedIn Person URN não configurado em extra_data['person_urn'].")

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
    }

    share_content: dict = {
        "shareCommentary": {"text": text},
        "shareMediaCategory": "NONE",
    }

    if image_path:
        # Registrar upload
        reg_resp = requests.post(
            "https://api.linkedin.com/v2/assets?action=registerUpload",
            headers=headers,
            json={
                "registerUploadRequest": {
                    "recipes": ["urn:li:digitalmediaRecipe:feedshare-image"],
                    "owner": person_urn,
                    "serviceRelationships": [
                        {"relationshipType": "OWNER", "identifier": "urn:li:userGeneratedContent"}
                    ],
                }
            },
        )
        reg_resp.raise_for_status()
        reg_data = reg_resp.json()
        upload_url = reg_data["value"]["uploadMechanism"][
            "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ]["uploadUrl"]
        asset = reg_data["value"]["asset"]

        # Upload da imagem
        with open(image_path, "rb") as img_file:
            requests.put(upload_url, headers={"Authorization": f"Bearer {token}"}, data=img_file)

        share_content["shareMediaCategory"] = "IMAGE"
        share_content["media"] = [{"status": "READY", "media": asset}]

    payload = {
        "author": person_urn,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": share_content
        },
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
    }

    resp = requests.post("https://api.linkedin.com/v2/ugcPosts", headers=headers, json=payload)
    resp.raise_for_status()
    return resp.json()
