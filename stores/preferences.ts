import { useRuntimeConfig } from 'nuxt/app';
import { defineStore } from 'pinia'
import { ref } from 'vue';
import type { PreferencesState, VerifyLinkResponse, TotpRequestResponse, UpdatePreferencesResponse } from '@/types';

export const usePreferencesStore = defineStore('preferences', () => {
  // Fonctions
  const config = useRuntimeConfig();
  const PGS_URL = config.public.pgsBaseAPI;

  // Données utilisateur
  const email = ref('');
  const maskedEmail = ref('');
  const firstName = ref('');
  const lastName = ref('');
  const company = ref('');
  const source = ref('');
  const newsletter = ref(true)

  // État du processus
  const currentStep = ref('initial');
  const isLoading = ref(false);

  // Messages
  const message = ref('');
  const messageType = ref('');

  // Données temporaires
  const totpCode = ref('');

  // Actions
  function resetState() {
    email.value = ''
    maskedEmail.value = ''
    firstName.value = ''
    lastName.value = ''
    company.value = ''
    source.value = ''
    newsletter.value = true
    currentStep.value = 'initial'
    isLoading.value = false
    message.value = ''
    messageType.value = ''
    totpCode.value = ''
  }

  // Afficher un message
  function setMessage(msg: string, type: 'success' | 'error' | 'info') {
    message.value = msg
    messageType.value = type

    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        message.value = ''
        messageType.value = ''
      }, 5000)
    }
  }

  // Vérifier le lien haché
  async function verifyLink(mailhash: string) {
    isLoading.value = true
    message.value = ''

    try {
      const response = await $fetch<VerifyLinkResponse>(`${PGS_URL}/suitops/beta/verify-update-link?mailhash=${mailhash}`, {
        method: 'GET'
      })

      if (response.canUpdate) {
        email.value = response.email
        maskedEmail.value = response.maskedEmail

        if (response.data) {
          firstName.value = response.data.firstName || ''
          lastName.value = response.data.lastName || ''
          company.value = response.data.company || ''
          source.value = response.data.source || ''
          newsletter.value = response.data.newsletter || true
        }

        currentStep.value = 'preferences_form'
        setMessage('Vérification réussie. Vous pouvez maintenant mettre à jour vos préférences.', 'success')
      }
    } catch (error: any) {
      console.error('Erreur lors de la vérification du lien:', error)

      if (error?.status === 400) {
        setMessage('Lien de mise à jour invalide ou expiré.', 'error')
      } else if (error?.status === 404) {
        setMessage('Adresse e-mail introuvable.', 'error')
      } else {
        setMessage('Une erreur est survenue lors de la vérification.', 'error')
      }

      currentStep.value = 'email_input'
    } finally {
      isLoading.value = false
    }
  }

  // Demander un code TOTP
  async function requestTotp(mail: string) {
    isLoading.value = true
    message.value = ''

    try {
      const response = await $fetch<TotpRequestResponse>(`${PGS_URL}/suitops/beta/verify-update-link`, {
        method: 'POST',
        body: { email: mail }
      })

      email.value = mail
      maskedEmail.value = response.maskedEmail
      currentStep.value = 'totp_input'
      setMessage('Un code de vérification a été envoyé à votre adresse e-mail.', 'info')

    } catch (error: any) {
      console.error('Erreur lors de la demande de TOTP:', error)

      if (error?.status === 404) {
        setMessage('Cette adresse e-mail n\'est pas inscrite à la bêta.', 'error')
      } else {
        setMessage('Une erreur est survenue lors de l\'envoi du code.', 'error')
      }

    } finally {
      isLoading.value = false
    }
  }

  // Vérifier le code TOTP
  async function verifyTotpCode(mail: string, totp: string) {
    isLoading.value = true
    message.value = ''

    try {
      const response = await $fetch<VerifyLinkResponse>(`${PGS_URL}/suitops/beta/verify-update-link`, {
        method: 'POST',
        body: { email: mail, totpCode: totp }
      })

      if (response.canUpdate) {
        email.value = response.email
        maskedEmail.value = response.maskedEmail

        if (response.data) {
          firstName.value = response.data.firstName || ''
          lastName.value = response.data.lastName || ''
          company.value = response.data.company || ''
          source.value = response.data.source || ''
          newsletter.value = response.data.newsletter || true
        }

        currentStep.value = 'preferences_form'
        setMessage('Code vérifié avec succès. Vous pouvez maintenant mettre à jour vos préférences.', 'success')
      }

    } catch (error: any) {
      console.error('Erreur lors de la vérification du TOTP:', error)

      if (error?.status === 400) {
        setMessage('Code TOTP invalide ou expiré.', 'error')
      } else {
        setMessage('Une erreur est survenue lors de la vérification du code.', 'error')
      }

    } finally {
      isLoading.value = false
    }
  }

  // Mettre à jour les préférences
  async function updatePreferences() {
    isLoading.value = true
    message.value = ''

    try {
      const response = await $fetch<UpdatePreferencesResponse>(`${PGS_URL}/suitops/beta/update-preferences`, {
        method: 'PUT',
        body: {
          email: email.value,
          firstName: firstName.value,
          lastName: lastName.value,
          company: company.value,
          source: source.value,
          newsletter: newsletter.value
        }
      })

      setMessage('Vos préférences ont été mises à jour avec succès.', 'success')

    } catch (error: any) {
      console.error('Erreur lors de la mise à jour des préférences:', error)

      if (error?.status === 400) {
        setMessage('Certaines données sont invalides. Veuillez vérifier vos informations.', 'error')
      } else if (error?.status === 404) {
        setMessage('Inscription non trouvée.', 'error')
      } else {
        setMessage('Une erreur est survenue lors de la mise à jour.', 'error')
      }

    } finally {
      isLoading.value = false
    }
  }

  // Retourn de l'état et des actions
  return {
    email, maskedEmail, firstName, lastName, company, source, newsletter,
    currentStep, isLoading,
    message, messageType,
    totpCode,

    resetState, setMessage, verifyLink, requestTotp, verifyTotpCode, updatePreferences
  }
});
