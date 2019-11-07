<template>
  <PageRecipesId v-bind="{recipesByCategory, recipe}" />
</template>

<script>
import { getResourceByAlias, findAllRecipesByCategoryName } from '~/lib/api';
import PageRecipesId from '~/components/PageRecipesId';
export default {
  transition: 'page',
  components: { PageRecipesId },
  async asyncData({ params }) {
    const recipe = await getResourceByAlias(params.alias);
    const recipesByCategory = await findAllRecipesByCategoryName(
      recipe.category.name,
      4
    );
    return { recipe, recipesByCategory };
  },
};
</script>
