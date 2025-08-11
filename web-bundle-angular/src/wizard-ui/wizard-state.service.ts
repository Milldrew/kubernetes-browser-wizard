import { Injectable, signal } from '@angular/core';
import { RECIPES, Recipe, Slide } from './wizard-ui.constants';

@Injectable({
  providedIn: 'root',
})
export class WizardState {
  currentRecipe = signal<Recipe>(RECIPES[0]);
  setCurrentRecipe(recipe: Recipe) {
    this.currentRecipe.set(recipe);
    this.resetCurrentSlideIndex();
  }
  currentSlideIndex = signal<number>(0);
  isFirstSlide = () => !this.currentSlideIndex();
  isLastSlide = () =>
    this.currentSlideIndex() === this.currentRecipe().slides.length - 1;
  resetCurrentSlideIndex() {
    this.currentSlideIndex.set(0);
  }
  recipes = signal<Recipe[]>(RECIPES);

  handleNextSlide() {
    if (this.isLastSlide()) {
      return;
    }
    this.currentSlideIndex.set(this.currentSlideIndex() + 1);
    this.currentSlide = this.getCurrentSlide();
  }
  handlePreviousSlide() {
    if (this.isFirstSlide()) {
      return;
    }
    this.currentSlideIndex.set(this.currentSlideIndex() - 1);
    this.currentSlide = this.getCurrentSlide();
  }
  lastSlideIndex = () => this.currentRecipe().slides.length - 1;
  getCurrentSlide(): Slide {
    return this.currentRecipe().slides[this.currentSlideIndex()];
  }
  currentSlide: Slide = this.getCurrentSlide();
  handleNewRecipeSelected() {
    console.log('new recipe selected');
    console.log(this.currentRecipe);
    console.log(this.currentRecipe());
    const recipeName = this.currentRecipe();
    const currentRecipe = this.recipes().find((recipe: any) => {
      return recipe.recipeTitle === recipeName;
    });
    if (!currentRecipe) {
      this.setCurrentRecipe(RECIPES[0]);
      this.currentRecipe.set(RECIPES[0]);
      return;
    }
    this.setCurrentRecipe(currentRecipe);
  }
}
