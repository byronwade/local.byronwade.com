/**
 * Verification Section Component
 * Handles partnership verification workflow and document management
 */

import React from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Progress } from "@components/ui/progress";
import { Alert, AlertDescription } from "@components/ui/alert";
import { ScrollArea } from "@components/ui/scroll-area";
import { Shield, Upload, FileText, CheckCircle, Clock, XCircle, Circle, Download, Eye, ArrowLeft, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getStatusBadge, getVerificationProgress, formatFileSize, isStepCompleted, isStepInProgress, getStepIconClass } from "@lib/data/business/partnerships/utils";
import { VERIFICATION_STATUS } from "@lib/data/business/partnerships/constants";

const VerificationStep = ({ step, partnershipId, onUpdateStep, isActive = false }) => {
	const statusConfig = getStatusBadge(step.status);
	const StatusIcon = statusConfig.icon === "CheckCircle" ? CheckCircle : statusConfig.icon === "Clock" ? Clock : statusConfig.icon === "XCircle" ? XCircle : Circle;

	const handleStatusChange = (newStatus) => {
		onUpdateStep(partnershipId, step.id, newStatus);
	};

	return (
		<motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`p-4 border rounded-lg transition-all ${isActive ? "border-primary bg-primary/5" : "border-muted"}`}>
			<div className="flex items-start justify-between">
				<div className="flex items-start space-x-3">
					<div className={`mt-1 ${getStepIconClass(step.status)}`}>
						<StatusIcon className="w-5 h-5" />
					</div>
					<div className="flex-1">
						<div className="flex items-center space-x-2">
							<h4 className="font-medium">{step.title}</h4>
							{step.required && (
								<Badge variant="outline" className="text-xs">
									Required
								</Badge>
							)}
						</div>
						<p className="text-sm text-muted-foreground mt-1">{step.description}</p>
						{step.completedDate && <p className="text-xs text-muted-foreground mt-2">Completed: {new Date(step.completedDate).toLocaleString()}</p>}
					</div>
				</div>

				{/* Step Actions */}
				<div className="flex items-center space-x-1">
					{step.status === VERIFICATION_STATUS.NOT_STARTED && (
						<Button size="sm" variant="outline" onClick={() => handleStatusChange(VERIFICATION_STATUS.IN_PROGRESS)}>
							Start
						</Button>
					)}
					{step.status === VERIFICATION_STATUS.IN_PROGRESS && (
						<>
							<Button size="sm" variant="default" onClick={() => handleStatusChange(VERIFICATION_STATUS.VERIFIED)}>
								Complete
							</Button>
							<Button size="sm" variant="outline" onClick={() => handleStatusChange(VERIFICATION_STATUS.REJECTED)}>
								Reject
							</Button>
						</>
					)}
					{step.status === VERIFICATION_STATUS.VERIFIED && (
						<Button size="sm" variant="outline" onClick={() => handleStatusChange(VERIFICATION_STATUS.IN_PROGRESS)}>
							Edit
						</Button>
					)}
					{step.status === VERIFICATION_STATUS.REJECTED && (
						<Button size="sm" variant="outline" onClick={() => handleStatusChange(VERIFICATION_STATUS.IN_PROGRESS)}>
							Retry
						</Button>
					)}
				</div>
			</div>
		</motion.div>
	);
};

const DocumentList = ({ documents, onRemove }) => {
	if (!documents || documents.length === 0) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				<FileText className="w-8 h-8 mx-auto mb-2" />
				<p>No documents uploaded yet</p>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{documents.map((doc) => (
				<div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
					<div className="flex items-center space-x-3">
						<FileText className="w-5 h-5 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">{doc.name}</p>
							<div className="flex items-center space-x-2 text-xs text-muted-foreground">
								<span>{formatFileSize(doc.size)}</span>
								<span>•</span>
								<span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
								<Badge variant="outline" className="text-xs">
									{doc.status}
								</Badge>
							</div>
						</div>
					</div>
					<div className="flex items-center space-x-1">
						<Button variant="ghost" size="sm">
							<Eye className="w-4 h-4" />
						</Button>
						<Button variant="ghost" size="sm">
							<Download className="w-4 h-4" />
						</Button>
					</div>
				</div>
			))}
		</div>
	);
};

const VerificationSection = ({ partnership, onClose, onCompleteVerification, onUpdateStep, onDocumentUpload, fileInputRef }) => {
	if (!partnership) return null;

	const verificationProgress = getVerificationProgress(partnership.verification);
	const verification = partnership.verification || {};
	const steps = verification.steps || [];
	const documents = verification.documents || [];

	const requiredSteps = steps.filter((step) => step.required);
	const completedRequiredSteps = requiredSteps.filter((step) => isStepCompleted(step));
	const canComplete = completedRequiredSteps.length === requiredSteps.length;

	return (
		<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
			<Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
				<CardHeader className="border-b">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Button variant="ghost" size="sm" onClick={onClose}>
								<ArrowLeft className="w-4 h-4" />
							</Button>
							<div>
								<CardTitle className="flex items-center space-x-2">
									<Shield className="w-5 h-5" />
									<span>Partnership Verification</span>
								</CardTitle>
								<CardDescription>{partnership.name} • Verification Process</CardDescription>
							</div>
						</div>
						<Badge variant={getStatusBadge(verification.status).variant}>{getStatusBadge(verification.status).text}</Badge>
					</div>

					{/* Progress Overview */}
					<div className="space-y-2 mt-4">
						<div className="flex items-center justify-between text-sm">
							<span>Overall Progress</span>
							<span className="font-medium">{verificationProgress}%</span>
						</div>
						<Progress value={verificationProgress} className="h-2" />
						<div className="flex items-center justify-between text-xs text-muted-foreground">
							<span>
								{completedRequiredSteps.length} of {requiredSteps.length} required steps completed
							</span>
							{verification.verificationId && <span className="font-mono">ID: {verification.verificationId}</span>}
						</div>
					</div>
				</CardHeader>

				<ScrollArea className="flex-1">
					<CardContent className="p-6 space-y-6">
						{/* Verification Steps */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Verification Steps</h3>
							<AnimatePresence>
								{steps.map((step, index) => (
									<VerificationStep key={step.id} step={step} partnershipId={partnership.id} onUpdateStep={onUpdateStep} isActive={isStepInProgress(step)} />
								))}
							</AnimatePresence>
						</div>

						{/* Document Upload */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold">Documents</h3>
								<Button variant="outline" onClick={() => fileInputRef.current?.click()}>
									<Upload className="w-4 h-4 mr-2" />
									Upload Documents
								</Button>
							</div>

							<DocumentList documents={documents} />

							<input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" onChange={onDocumentUpload} className="hidden" />
						</div>

						{/* Completion Actions */}
						<div className="space-y-4 pt-6 border-t">
							{!canComplete && (
								<Alert>
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>Complete all required verification steps before finalizing the verification process.</AlertDescription>
								</Alert>
							)}

							<div className="flex items-center justify-between">
								<div className="text-sm text-muted-foreground">{canComplete ? "All required steps completed. Ready to verify partnership." : `${requiredSteps.length - completedRequiredSteps.length} required steps remaining`}</div>
								<div className="flex items-center space-x-2">
									<Button variant="outline" onClick={onClose}>
										Save & Continue Later
									</Button>
									<Button variant="default" onClick={onCompleteVerification} disabled={!canComplete}>
										<CheckCircle className="w-4 h-4 mr-2" />
										Complete Verification
									</Button>
								</div>
							</div>
						</div>
					</CardContent>
				</ScrollArea>
			</Card>
		</motion.div>
	);
};

export default VerificationSection;
