{% extends 'base_front.html.twig' %}
{% block javascripts %}
{{ parent() }}
{{ encore_entry_script_tags('product') }}
{% endblock %}
{% block title %}ArtLab - {{ product.name }}{% endblock %}

{% block body %}
<main class="bg-white pt-10 lg:pt-20 md:pt-24 sm:pt-24">
<div class="bg-white mx-[42px] max-w-2xl py-[42px] px-4 sm:py-[42px] sm:px-6 lg:max-w-7xl lg:px-8">
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <a href="{{ path('front_app_default') }}"
           class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-orange-500">
          Home
        </a>
      </li>
      <li>
        <div class="flex items-center">
          <span class="mx-2 text-gray-400">/</span>
          <a href="{{ path('front_app_default_category', {slug: product.category.slug}) }}" class="ml-1 text-sm font-medium text-gray-500 hover:text-orange-500 md:ml-2">{{ product.category.name }}</a>
        </div>
      </li>
      <li aria-current="page">
        <div class="flex items-center">
          <span class="mx-2 text-gray-400">/</span>
          <span class="ml-1 text-sm font-medium text-black-500 md:ml-2">{{ product.name }}</span>
        </div>
      </li>
    </ol>
  </nav>
</div>
<!-- Images -->
<section class="text-gray-700 body-font overflow-hidden bg-white w-full">
  <div class="container px-5 xs:mx-auto w-full xl:mx-2">
    <div class="lg:w-full mx-auto flex md:flex-col-reverse lg:flex-row xl:flex-row 2xl:flex-row sm:flex-col-reverse xs:flex-col-reverse">
      <div class="w-full flex flex-col items-center">
        {% for image in product.imageProducts %}
        {% if image.favorite %}
        <img id="primary_image" alt="{{ image.source }}"
             class="lg:w-3/4 w-full object-scale-down object-center rounded-lg border border-gray-200 h-[650px] w-[700px] "
             src="{{ asset('uploads/images/' ~ image.source) }}">
        {% endif %}
        {% endfor %}
        <!--thumbnails -->
        <div class="w-full px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-2xl py-1 sm:py-2 lg:max-w-none lg:py-3">
            <div id="thumbnails" class="mt-6 flex w-full justify-center gap-6">
              {% for image in product.imageProducts %}
              <div class="group relative w-fit border border-solid rounded-lg">
                <div class="h-[100px] w-[100px] overflow-hidden rounded-lg bg-white group-hover:opacity-75">
                  <img src="{{ asset('uploads/images/' ~ image.source) }}" alt="{{ image.source }}" class="h-full object-scale-down">
                </div>
              </div>
              {% endfor %}
            </div>
          </div>
        </div>
      </div>
      <div class="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
        {% for message in app.flashes('addSuccess') %}
        <div class="p-3 rounded bg-green-500 text-green-100 mb-4">
          <span>{{ message }}</span>
        </div>
        {% endfor %}
        <h1 class="text-gray-900 text-3xl title-font font-medium mb-1">{{ product.name }}</h1>
        <p class="leading-relaxed text-lg">{{ product.description }}</p>
        <div class="flex mb-4">
                              <span class="flex items-center">
                                {% set allComments = comments|filter((cmt) => cmt.getProductIdentifier().getId() == product.id) %}
                                  {% if allComments|length == 0 %}
                                      {% for i in 0..4 %}
                                          <svg class="text-gray-200 h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                              <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
                                          </svg>
                                      {% endfor %}
                                      <span class="text-gray-600 ml-3 text-sm">(0)</span>
                                  {% else %}
                                      {% set commentavg = 0 %}
                                      {% for comment in allComments %}
                                          {% set commentavg = commentavg + comment.stars %}
                                      {% endfor %}
                                      {% set avg = commentavg / allComments|length %}
                                      {% for i in 0..4 %}
                                          {% if i < avg %}
                                              <svg class="text-orange-500 h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                              <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
                                          </svg>
                                      {% else %}
                                              <svg class="text-gray-200 h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                              <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
                                          </svg>
                                          {% endif %}
                                      {% endfor %}
                                  <span class="text-gray-600 ml-3 text-sm">({{ allComments|length }})</span>
                                      <a href="#comments" class="ml-3 text-blue-500 font-light">Voir les commentaires</a>
                                  {% endif %}
                              </span>
        </div>
        <div class="block w-full mx-auto" aria-hidden="true">
          <div class="py-5 flex justify-center">
            <div class="border-t border-gray-200 w-3/4"></div>
          </div>
        </div>
        <span class="title-font font-medium text-4xl text-gray-900 justify-items-start">{{ product.price }}€</span>
        <div class="block w-full mx-auto" aria-hidden="true">
          <div class="py-5 flex justify-center">
            <div class="border-t border-gray-200 w-3/4"></div>
          </div>
        </div>

        {% if product.stock.getAvailableQuantity is defined and product.stock.getAvailableQuantity != 0 %}
        <form action="{{ path('front_cart_add', {'slug': product.slug}) }}" method="post">
          <input type="hidden" name="_token" value="{{ csrf_token('add' ~ product.id) }}">
          <div class="flex w-full items-center gap-7 mt-10">
            {% set stock = product.stock %}
            {% include "_partials/_quantity.html.twig" %}
            <h4>{{ (stock.getAvailableQuantity() - stock.getMinimumQuantity() <= 10) ? 'Seulement' : '' }}
              <span class="text-orange-500">{{ stock.getAvailableQuantity() - stock.getMinimumQuantity()}} produits</span> restant !</h4>
          </div>
          <div class="flex gap-[40px] xl:flex-row 2xl:flex-row lg:flex-col md:flex-row lg:gap-[10px] md:gap-[10px] md:mt-10 md:mb-10 sm:flex-row sm:mt-10 sm:mb-10 xs:my-10">
            <button type="submit" id="add-to-cart" class="xl:mt-10 2xl:mt-10 lg:mt-1 app.user.addresses|filter(addr => addr.isActive)|length > 0md:mt-1 flex w-fit items-center justify-center rounded-full border border-orange-500 bg-white py-3 px-8 text-base font-medium text-orange-500 hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Ajouter au panier</button>
          </div>
        </form>
        {% else %}
        <div class="text-red-500 text-center">Produit indisponible</div>
        {% endif %}
      </div>
    </div>

  </div>
</section>
<!-- description -->
<div class="mx-auto mt-6 w-3/4 sm:2/4 xs: 3/4 bg-white mb-5">


  {% for criteria in criterion %}
  <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 {{ loop.index != 1 ? 'border-t border-gray-200' : ''}}">
    <dt class="text-sm font-medium text-black-500">
      <h3>{{ criteria.criterion.name }}</h3>
      <p class="text-gray-500 truncate">{{ criteria.criterion.description }}</p>
    </dt>
    <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ criteria.value|default('-') }}</dd>
  </div>
  {% endfor %}

</div>

{% if product.comments.count %}
<div class="mx-auto mt-6 w-3/4 sm:2/4 xs: 3/4 bg-white my-5" id="comments">
  <h3 class="text-3xl font-bold mb-4">Commentaires produit</h3>

  {% for comment in product.comments %}
  <div class="border-b border-solid border-gray-300">
    <div>
      <div class="flex items-center">
        <p class="font-bold pr-3">{{ comment.userIdentifier.firstname }} {{ comment.userIdentifier.lastname }}{% if app.user and app.user.id == comment.userIdentifier.id %}<a href="{{ path('front_user_order') }}"><i class="text-orange-500 fa-solid ml-2 fa-pen-to-square"></i></a>{% endif %}</p>
        </p>
        {% for i in 1..5 %}
        {% if i <= comment.stars %} <i class="fa-solid fa-star text-secondary"></i> {% else %} <i class="fa-solid fa-star"></i> {% endif %}
        {% endfor %}
      </div>
    </div>
    <p class="font-light text-gray-600">{{ comment.comment }}</p>
    <p class="mb-4 mt-2 italic text-sm font-light">Créé le : {{ comment.createdAt ? comment.createdAt|date('d/m/Y') : '' }}</p>
  </div>
  {% endfor %}
</div>
{% endif %}
</main>
{% endblock %}