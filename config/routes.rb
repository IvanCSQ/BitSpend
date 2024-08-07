Rails.application.routes.draw do
  get 'expenses/index'
  # get 'pages/home'
  devise_for :users, controllers: {
    registrations: "users/registrations",
    sessions: "users/sessions",
    omniauth_callbacks: "users/omniauth_callbacks"
  }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  root to: "pages#home"
  # resources :pages, only: [:home]
  resources :expenses, only: [:new, :create, :index]
  get "analysis", to: "expenses#analysis"

  resources :categories, only: [:index, :new, :create]
  resources :conversations, only: [:index]
  resources :conversation_responses, only: [:index] do
    collection do
      post :upload
      get :stream_response
    end
  end
end
