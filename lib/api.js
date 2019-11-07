/**
 * Functions to get content from Contenta JSON API
 */
import jsonApi from './jsonApiClient';

/**
 * @param {String} uuid
 */
export function findOneRecipeByUuid(uuid) {
  console.log('find by uuid');
  const query = {
    include: 'image,category,image.thumbnail',
    filter: {
      isPublished: {
        path: 'isPublished',
        value: 1,
      },
    },
  };
  return jsonApi.get(`recipes/${uuid}`, query);
}

export function findAllPromotedRecipes(limit = 4) {
  const query = {
    page: {
      limit,
    },
    filter: {
      isPromoted: {
        path: 'isPromoted',
        value: 1,
      },
      isPublished: {
        path: 'isPublished',
        value: 1,
      },
    },
    include: 'image,image.thumbnail',
    fields: {
      recipes: 'title,difficulty,image',
      images: 'name,thumbnail',
      files: 'filename,uri',
    },
    sort: '-created',
  };
  return jsonApi.get('recipes', query);
}

export function findAllRecipesCategories(limit = 20) {
  const query = {
    page: {
      limit,
    },
  };
  return jsonApi.get('categories', query);
}

export function findAllLatestRecipes(limit = 4, offset = 0) {
  const query = {
    sort: '-created',
    page: {
      limit,
    },
    include: 'image,image.thumbnail',
    fields: {
      recipes: 'title,difficulty,image',
      images: 'name,thumbnail',
      files: 'filename,uri',
    },
  };
  return jsonApi.get('recipes', query);
}

export function findHomePromotedArticlesAndRecipes(limit) {
  const promotedRecipes = jsonApi.get('recipes', {
    page: {
      limit: 3,
    },
    filter: {
      isPromoted: {
        path: 'isPromoted',
        value: 1,
      },
      isPublished: {
        path: 'isPublished',
        value: 1,
      },
    },
    include: 'contentType,image,image.thumbnail',
    fields: {
      recipes: 'contentType,title,difficulty,image',
      images: 'name,thumbnail',
      files: 'filename,uri',
      contentTypes: 'type',
    },
    sort: '-created',
  });
  const promotedArticles = jsonApi.get('articles', {
    page: {
      limit: 3,
    },
    filter: {
      isPromoted: {
        path: 'isPromoted',
        value: 1,
      },
      isPublished: {
        path: 'isPublished',
        value: 1,
      },
    },
    include: 'contentType,image,image.thumbnail',
    fields: {
      recipes: 'title,difficulty,image',
      images: 'name,thumbnail',
      files: 'filename,uri',
      contentTypes: 'type',
    },
    sort: '-created',
  });
  return Promise.all([promotedRecipes, promotedArticles]).then(
    promisesValues => {
      const data = [...promisesValues[0], ...promisesValues[1]]
        .sort((item1, item2) => item1.createdAt > item2.createdAt)
        .slice(0, limit);
      return data;
    }
  );
}

export function findAllRecipesByCategoryName(
  categoryName,
  limit = 4,
  offset = 0
) {
  const query = {
    sort: '-created',
    include: 'image,image.thumbnail',
    filter: {
      categoryName: {
        condition: {
          path: 'category.name',
          value: categoryName,
        },
      },
    },
    fields: {
      recipes: 'title,difficulty,image',
      images: 'name,thumbnail',
      files: 'filename,uri',
    },
    page: {
      offset: 0,
      limit: limit,
    },
  };
  return jsonApi.get('recipes', query);
}

export function findAllRecipesByDifficultyName(
  difficultyName,
  limit = 4,
  offset = 0
) {
  const query = {
    sort: '-created',
    include: 'image,image.thumbnail',
    filter: {
      difficulty: {
        path: 'difficulty',
        value: difficultyName,
      },
    },
    fields: {
      recipes: 'title,difficulty,image',
      images: 'name,thumbnail',
      files: 'filename,uri',
    },
    page: {
      offset: 0,
      limit: limit,
    },
  };
  return jsonApi.get('recipes', query);
}

export function findAllRecipesByMaxTotalTime(
  maxTotalTime,
  limit = 4,
  offset = 0
) {
  const query = {
    sort: '-created',
    include: 'image,image.thumbnail',
    filter: {
      totalTime: {
        condition: {
          path: 'totalTime',
          value: maxTotalTime,
          operator: '<',
        },
      },
    },
    fields: {
      recipes: 'title,difficulty,image',
      images: 'name,thumbnail',
      files: 'filename,uri',
    },
    page: {
      offset: 0,
      limit: limit,
    },
  };
  return jsonApi.get('recipes', query);
}

export function findResourceByAlias(alias) {
  console.log('find by alias ' + alias);
  const query = {
    path: alias,
  };
  return jsonApi.get('router/translate-path', query, 'server');
}

export async function getResourceByAlias(alias) {
  console.log('get by alias ' + alias);
  const resolveQuery = {
    path: alias,
    _format: 'json',
  };
  const resolveUrl = jsonApi.prepareUrl(
    '/router/translate-path',
    resolveQuery,
    false
  );
  const resourceQuery = {
    include: 'image,category,image.thumbnail',
  };
  let resourceUrl = jsonApi.prepareUrl(
    '{{router.body@$.jsonapi.individual}}',
    resourceQuery,
    false
  );
  const data = [
    {
      requestId: 'router',
      action: 'view',
      uri: resolveUrl,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
    {
      requestId: 'resource',
      action: 'view',
      uri: resourceUrl,
      waitFor: ['router'],
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  ];
  const response = await jsonApi.post(
    'subrequests',
    { _format: 'json' },
    JSON.stringify(data),
    'server'
  );
  console.log(response);
  return '';
}
