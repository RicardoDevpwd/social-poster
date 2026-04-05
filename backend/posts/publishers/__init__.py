def dispatch_publish(social_account, post):
    """
    Despacha a publicação para o publisher correto.
    Importação lazy para evitar erros de módulo na inicialização.
    Retorna: {"success": bool, "response": dict | None, "error": str | None}
    """
    from .instagram import publish as instagram_publish
    from .twitter import publish as twitter_publish
    from .facebook import publish as facebook_publish
    from .linkedin import publish as linkedin_publish
    from .tiktok import publish as tiktok_publish

    PUBLISHERS = {
        "instagram": instagram_publish,
        "twitter": twitter_publish,
        "facebook": facebook_publish,
        "linkedin": linkedin_publish,
        "tiktok": tiktok_publish,
    }

    platform = social_account.platform
    publisher = PUBLISHERS.get(platform)
    if not publisher:
        return {"success": False, "response": None, "error": f"Plataforma '{platform}' não suportada."}

    image_path = post.image.path if post.image else None
    try:
        result = publisher(social_account, post.text, image_path)
        return {"success": True, "response": result, "error": None}
    except Exception as exc:
        return {"success": False, "response": None, "error": str(exc)}
